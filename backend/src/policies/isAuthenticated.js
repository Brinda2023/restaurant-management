const utils = require("@strapi/utils");
const { PolicyError } = utils.errors;

module.exports = async (policyContext, config, { strapi }) => {
  if (!policyContext.state.user) {
    throw new PolicyError("Token error!");
  }
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
      case "customer":
        console.log(policyContext.state.route.path);
        switch (policyContext.state.route.path) {
          case "/orders":
          case "/orders/:id":
            {
              const user = await fetchUser();
              if (!user || !user.restaurants) {
                throw new PolicyError("Data not found for you!");
              }
              if (params.id) {
                if (
                  (
                    await strapi.db
                      .query("api::order.order")
                      .findMany({
                        where: {
                          customer: { id: policyContext.state.user.id },
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
                  restaurant: { id: user.restaurants[0].id },
                };
              }
            }
            break;
          default:
            return true;
            break;
        }
        break;

      case "admin":
      case "worker":
      case "manager":
        {
          console.log(policyContext.state.route.path);
          switch (policyContext.state.route.path) {
            case "/orders":
            case "/orders/:id":
              {
                const user = await fetchUser();
                if (!user || !user.restaurants) {
                  throw new PolicyError("Data not found for you!");
                }
                if (params.id) {
                  if (
                    (
                      await strapi.db
                        .query("api::order.order")
                        .findMany({
                          where: {
                            restaurant: { id: user.restaurants[0].id },
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
                    restaurant: { id: user.restaurants[0].id },
                  };
                }
              }
              break;

            case "/restaurants":
            case "/restaurants/:id":
              {
                const user = await fetchUser();
                if (!user || !user.restaurants) {
                  throw new PolicyError("Data not found for you!");
                }
                console.log(request.query.filters.id);
                if (
                  (params.id &&
                    parseInt(params.id) !== user.restaurants[0].id) ||
                  (request.query.filters.id &&
                    parseInt(request.query.filters.id) !==
                      user.restaurants[0].id)
                ) {
                  throw new PolicyError("Data not found!");
                } else {
                  request.query.filters = {
                    ...request.query.filters,
                    id: user.restaurants[0].id,
                  };
                }
              }
              break;

            case "/categories":
            case "/categories/:id":
              {
                const user = await fetchUser();
                if (!user || !user.restaurants) {
                  throw new PolicyError("Data not found for you!");
                }

                if (params.id) {
                  const rest = await fetchRest(user.restaurants[0].id);
                  const inArray = rest.categories.map((category) => {
                    return { id: category.id };
                  });
                  if (!params.id.includes(inArray)) {
                    throw new PolicyError("Data not found!");
                  }
                } else {
                  request.query.filters = {
                    ...request.query.filters,
                    restaurant: user.restaurants[0].id,
                  };
                }
                console.log(request.query);
              }
              break;

            case "/menu-items":
            case "/menu-items/:id":
              {
                const user = await fetchUser();
                if (!user || !user.restaurants) {
                  throw new PolicyError("Data not found for you!");
                }
                const rest = await fetchRest(user.restaurants[0].id);
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
                                    ).restaurants[0].id
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

  return false; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
