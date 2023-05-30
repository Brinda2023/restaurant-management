const utils = require("@strapi/utils");
const { PolicyError } = utils.errors;

module.exports = async (policyContext, { strapi }) => {
  let { params, request } = policyContext;

  // Fetch current User
  const fetchUser = async () => {
    return await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { id: policyContext.state.user.id }, populate: true });
  };

  // Fetch restaurant of given id
  const fetchRest = async (id) => {
    return await strapi.db
      .query("api::restaurant.restaurant")
      .findOne({ where: { id }, populate: true });
  };

  // Fetch order of given id and param
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

  // Fetch customer with populated orders
  const fetchCustomer = async (id) => {
    return await strapi.db
      .query("api::customer.customer")
      .findOne({ where: { id }, populate: { orders: true } });
  };

  if (policyContext.state.user) {
    switch (policyContext.state.user.role.type) {
      // if current user is authenticated - Super Admin then return true
      case "authenticated":
        return true;
        break;
      // if current user is Owner, Manager or Worker
      case "restaurant_owner":
      case "restaurant_worker":
      case "restaurant_manager":
        {
          // if path is orders or orders id
          switch (policyContext.state.route.path) {
            case "/orders":
            case "/orders/:id":
              {
                // Fetch user
                const user = await fetchUser();
                // if user or user's restaurant not found then throw error
                if (!user || !user.restaurant) {
                  throw new PolicyError("Data not found for you!");
                }
                // check for user id path
                if (params.id) {
                  // if order exists for given retaurant id return true else throw error
                  if (
                    // fetch order for that restaurant id
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

            // if path is restaurant or restaurant id
            case "/restaurants":
            case "/restaurants/:id":
              {
                // Fetch user
                const user = await fetchUser();
                // if user or user's restaurant not found then throw error
                if (!user || !user.restaurant) {
                  throw new PolicyError("Data not found for you!");
                }
                // if user is not login in his restaurant then throw error
                if ((params.id && parseInt(params.id)) !== user.restaurant.id) {
                  throw new PolicyError("Data not found!");
                } else if (request.query.filters) {
                  // if filter doesn't contains users restaurant id then throw error
                  if (
                    parseInt(request.query.filters.id) !== user.restaurant.id
                  ) {
                    throw new PolicyError("Data not found!");
                  }
                } else {
                  // filter restaurants with login restaurant user
                  request.query.filters = {
                    ...request.query.filters,
                    id: user.restaurant.id,
                  };
                }
              }
              return true;
              break;

            // if path is categories or categories id
            case "/categories":
            case "/categories/:id":
              {
                // Fetch user
                const user = await fetchUser();
                // if user or user's restaurant not found then throw error
                if (!user || !user.restaurant) {
                  throw new PolicyError("Data not found for you!");
                }
                // for categories id path
                if (params.id) {
                  // Fetch restaurant of current user
                  const rest = await fetchRest(user.restaurant.id);
                  // get categories id of current user's restaurant
                  const inArray = rest.categories.map((category) => {
                    return category.id.toString();
                  });
                  // if list not contains params category id then throw error
                  if (!inArray.includes(params.id)) {
                    throw new PolicyError("Data not found!");
                  }
                } else {
                  if (
                    // if method is POST and user's restaurant id is not category's restaurant id then return false
                    policyContext.state.route.method === "POST" &&
                    parseInt(request.body.data.restaurant) !==
                      user.restaurant.id
                  ) {
                    return false;
                  }
                  // filter categories of current user's restaurant
                  request.query.filters = {
                    ...request.query.filters,
                    restaurant: user.restaurant.id,
                  };
                }
              }
              return true;
              break;

            // if path is menu-item or menu-item id
            case "/menu-items":
            case "/menu-items/:id":
              {
                // for menu-item id path
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
  // if path is restaurant or restaurant id and method is GET
  if (
    (policyContext.state.route.path === "/restaurants" ||
      policyContext.state.route.path === "/restaurants/:id") &&
    policyContext.state.route.method === "GET"
  ) {
    // can populate categories only
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
  // if path is categories or categories id and method is GET
  if (
    (policyContext.state.route.path === "/categories" ||
      policyContext.state.route.path === "/categories/:id") &&
    policyContext.state.route.method === "GET"
  ) {
    // populate menu-items only
    if (request.query.populate) {
      request.query.populate = {
        restaurant: false,
        menu_items: true,
      };
    }
    return true;
  }
  // if path is orders or orders id and method is GET
  if (
    (policyContext.state.route.path === "/orders" &&
      policyContext.state.route.method === "GET") ||
    policyContext.state.route.path === "/orders/:id"
  ) {
    // Check if customer token is provided or not
    if (request.header.token && request.header.token.id) {
      // if path is orders id
      if (params.id) {
        if (
          // fetch order
          (await fetchOrder(request.header.token.id, "customer")).includes(
            parseInt(params.id)
          )
        ) {
          return true;
        } else {
          throw new PolicyError("Data not found!");
        }
      } else {
        // filter with customer id
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
  // if path is order-details or order-details id and method is GET
  if (
    (policyContext.state.route.path === "/order-details" &&
      policyContext.state.route.method === "GET") ||
    policyContext.state.route.path === "/order-details/:id"
  ) {
    // if there exists customer token
    if (request.header.token && request.header.token.id) {
      // if order-details id exists
      if (params.id) {
        if (
          // find order-details
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
  // if path is order-details and method is POST
  if (
    policyContext.state.route.path === "/order-details" &&
    policyContext.state.route.method === "POST"
  ) {
    // Check if customer token exists
    if (request.header.token && request.header.token.id) {
      if (
        // Fetch order
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
  // if path is customers r customers id and method is GET
  if (
    (policyContext.state.route.path === "/customers" &&
      policyContext.state.route.method === "GET") ||
    policyContext.state.route.path === "/customers/:id"
  ) {
    // if customer token exists
    if (request.header.token && request.header.token.id) {
      if (params.id && parseInt(params.id) !== request.header.token.id) {
        return false;
      } else {
        if (
          request.query.populate &&
          parseInt(params.id) !== request.header.token.id
        ) {
          request.query.populate = {};
        }
        request.query.filters = {
          ...request.query.filters,
          id: request.header.token.id,
        };
        return true;
      }
    } else {
      return false;
    }
    return true;
  }

  return true; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
