const utils = require("@strapi/utils");
const { PolicyError } = utils.errors;

module.exports = async (policyContext, config, { strapi }) => {
  let { params, request } = policyContext;

  const fetchUser = async () => {
    return await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { id: policyContext.state.user.id }, populate: true });
  };

  const fetchRest = async (id) => {
    return await strapi.db
      .query("api::restaurant.restaurant")
      .findOne({ where: { id }, populate: true });
  };

  const fetchOrder = async (id, param) => {
    return await strapi.db
      .query("api::order.order")
      .findMany({
        where: {
          [param]: { id },
        },
        select: ["id"],
      })
      .then((item) => {
        return item.map((item) => item.id);
      });
  };

  const fetchCustomer = async (id) => {
    return await strapi.db
      .query("api::customer.customer")
      .findOne({ where: { id }, populate: { orders: true } });
  };

  if (policyContext.state.user) {
    switch (policyContext.state.user.role.type) {
      case "authenticated":
        return true;
        break;
      case "restaurant_owner":
      case "restaurant_worker":
      case "restaurant_manager":
        {
          switch (policyContext.state.route.path) {
            case "/orders":
            case "/orders/:id":
              {
                const user = await fetchUser();
                if (!user || !user.restaurant) {
                  throw new PolicyError("Data not found for you!");
                }
                if (params.id) {
                  if (
                    (
                      await fetchOrder(user.restaurant.id, "restaurant")
                    ).includes(parseInt(params.id))
                  ) {
                    return true;
                  } else {
                    throw new PolicyError("Data not found!");
                  }
                } else {
                  request.query.filters = {
                    ...request.query.filters,
                    restaurant: { id: user.restaurant.id },
                  };
                }
              }
              return true;
              break;

            case "/restaurants":
            case "/restaurants/:id":
              {
                const user = await fetchUser();
                if (!user || !user.restaurant) {
                  throw new PolicyError("Data not found for you!");
                }
                if ((params.id && parseInt(params.id)) !== user.restaurant.id) {
                  throw new PolicyError("Data not found!");
                } else if (request.query.filters) {
                  if (
                    parseInt(request.query.filters.id) !== user.restaurant.id
                  ) {
                    throw new PolicyError("Data not found!");
                  }
                } else {
                  request.query.filters = {
                    ...request.query.filters,
                    id: user.restaurant.id,
                  };
                }
              }
              return true;
              break;

            case "/categories":
            case "/categories/:id":
              {
                const user = await fetchUser();
                if (!user || !user.restaurant) {
                  throw new PolicyError("Data not found for you!");
                }

                if (params.id) {
                  const rest = await fetchRest(user.restaurant.id);
                  const inArray = rest.categories.map((category) => {
                    return category.id.toString();
                  });
                  if (!inArray.includes(params.id)) {
                    throw new PolicyError("Data not found!");
                  }
                } else {
                  if (
                    policyContext.state.route.method === "POST" &&
                    parseInt(request.body.data.restaurant) !==
                      user.restaurant.id
                  ) {
                    return false;
                  }
                  request.query.filters = {
                    ...request.query.filters,
                    restaurant: user.restaurant.id,
                  };
                }
              }
              return true;
              break;

            case "/menu-items":
            case "/menu-items/:id":
              {
                if (params.id) {
                  if (
                    (
                      await strapi.db
                        .query("api::menu-item.menu-item")
                        .findMany({
                          where: {
                            category: {
                              id: {
                                $in: (
                                  await fetchRest(
                                    (
                                      await fetchUser()
                                    ).restaurant.id
                                  )
                                ).categories.map((cat) => cat.id),
                              },
                            },
                          },
                          select: ["id"],
                        })
                        .then((item) => {
                          return item.map((item) => item.id);
                        })
                    ).includes(parseInt(params.id))
                  ) {
                    return true;
                  } else {
                    throw new PolicyError("Data not found!");
                  }
                } else {
                  if (
                    policyContext.state.route.method === "POST" &&
                    !(
                      await fetchRest((await fetchUser()).restaurant.id)
                    ).categories
                      .map((cat) => cat.id)
                      .includes(parseInt(request.body.data.categoryId))
                  ) {
                    return false;
                  }
                  request.query.filters = {
                    ...request.query.filters,
                    category: {
                      id: {
                        $in: (
                          await fetchRest((await fetchUser()).restaurant.id)
                        ).categories.map((cat) => cat.id),
                      },
                    },
                  };
                }
              }
              return true;
              break;
            default:
              return true;
              break;
          }
        }
        break;
      default:
        return true;
        break;
    }
    return true;
  }
  if (
    (policyContext.state.route.path === "/restaurants" ||
      policyContext.state.route.path === "/restaurants/:id") &&
    policyContext.state.route.method === "GET"
  ) {
    if (request.query.populate) {
      request.query.populate = {
        customers: false,
        orders: false,
        users: false,
        categories: true,
      };
    }
    return true;
  }
  if (
    (policyContext.state.route.path === "/categories" ||
      policyContext.state.route.path === "/categories/:id") &&
    policyContext.state.route.method === "GET"
  ) {
    if (request.query.populate) {
      request.query.populate = {
        restaurant: false,
        menu_items: true,
      };
    }
    return true;
  }
  if (
    (policyContext.state.route.path === "/orders" &&
      policyContext.state.route.method === "GET") ||
    policyContext.state.route.path === "/orders/:id"
  ) {
    if (request.header.token && request.header.token.id) {
      if (params.id) {
        if (
          (await fetchOrder(request.header.token.id, "customer")).includes(
            parseInt(params.id)
          )
        ) {
          return true;
        } else {
          throw new PolicyError("Data not found!");
        }
      } else {
        request.query.filters = {
          ...request.query.filters,
          customer: { id: request.header.token.id },
        };
      }
    } else {
      return false;
    }
    return true;
  }

  if (
    (policyContext.state.route.path === "/order-details" &&
      policyContext.state.route.method === "GET") ||
    policyContext.state.route.path === "/order-details/:id"
  ) {
    if (request.header.token && request.header.token.id) {
      if (params.id) {
        if (
          (
            await strapi.db
              .query("api::order-detail.order-detail")
              .findMany({
                where: {
                  order: {
                    id: {
                      $in: (
                        await fetchCustomer(request.header.token.id)
                      ).orders.map((o) => o.id),
                    },
                  },
                },
                select: ["id"],
              })
              .then((orderDetails) => {
                return orderDetails.map((od) => od.id);
              })
          ).includes(parseInt(params.id))
        ) {
          return true;
        } else {
          throw new PolicyError("Data not found!");
        }
      } else {
        request.query.filters = {
          ...request.query.filters,
          order: {
            id: {
              $in: (await fetchCustomer(request.header.token.id)).orders.map(
                (o) => o.id
              ),
            },
          },
        };
      }
    } else {
      return false;
    }
    return true;
  }
  if (
    policyContext.state.route.path === "/order-details" &&
    policyContext.state.route.method === "POST"
  ) {
    if (request.header.token && request.header.token.id) {
      if (
        (await fetchOrder(request.header.token.id, "customer")).includes(
          parseInt(request.body.data.order)
        )
      ) {
        return true;
      } else {
        throw new PolicyError("Data not found!");
      }
    } else {
      return false;
    }
    return true;
  }

  return true; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
