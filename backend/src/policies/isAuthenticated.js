const utils = require("@strapi/utils");
const { PolicyError } = utils.errors;

module.exports = async (policyContext, config, { strapi }) => {
  let { params, request } = policyContext;
  console.log("params", params);
  console.log("req", request.query);

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

  if (policyContext.state.user) {
    console.log(policyContext.state.user.role.type);
    switch (policyContext.state.user.role.type) {
      case "authenticated":
        return true;
        break;
      case "restaurant_owner":
      case "restaurant_worker":
      case "restaurant_manager":
        {
          console.log(policyContext.state.route.path);
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
                      await strapi.db
                        .query("api::order.order")
                        .findMany({
                          where: {
                            restaurant: { id: user.restaurant.id },
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
                  console.log("here2");
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
                  console.log("Here1");
                  throw new PolicyError("Data not found!");
                } else if (request.query.filters) {
                  console.log("Here2");
                  if (
                    parseInt(request.query.filters.id) !== user.restaurant.id
                  ) {
                    console.log("Here3");
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
                  request.query.filters = {
                    ...request.query.filters,
                    restaurant: user.restaurant.id,
                  };
                }
                console.log(request.query);
              }
              return true;
              break;

            case "/menu-items":
            case "/menu-items/:id":
              {
                const user = await fetchUser();
                if (!user || !user.restaurant) {
                  throw new PolicyError("Data not found for you!");
                }
                const rest = await fetchRest(user.restaurant.id);
                const inArray = rest.categories.map((category) => {
                  return { id: category.id };
                });

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
                  request.query.filters = {
                    ...request.query.filters,
                    category: {
                      $or: inArray,
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

  return true; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
