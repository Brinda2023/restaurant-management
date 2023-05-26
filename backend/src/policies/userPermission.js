const utils = require("@strapi/utils");
const { PolicyError } = utils.errors;
module.exports = async (policyContext, config, { strapi }) => {
  let { params, request } = policyContext;
  console.log("params", params);
  console.log("req", request.query);

  const fetchUser = async (id) => {
    return await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { id }, populate: true });
  };

  let manager;
  let worker;
  let owner;
  const fetchRole = async () => {
    const roles = await strapi.db
      .query("plugin::users-permissions.role")
      .findMany({ where: {}, select: ["id", "type"] });
    roles.forEach((role) => {
      if (role.type === "restaurant_manager") {
        manager = role.id;
      }
      if (role.type === "restaurant_worker") {
        worker = role.id;
      }
      if (role.type === "restaurant_owner") {
        owner = role.id;
      }
    });
    return roles;
  };

  if (policyContext.state.user) {
    console.log(policyContext.state.user.role.type);
    switch (policyContext.state.user.role.type) {
      case "authenticated":
        if (
          policyContext.state.route.path === "/users/:id" &&
          (policyContext.state.route.method === "DELETE" ||
            policyContext.state.route.method === "PUT" ||
            policyContext.state.route.method === "GET")
        ) {
          await fetchRole();
          if (
            request.body.role !== owner &&
            request.body.role !== manager &&
            request.body.role !== worker
          ) {
            if (
              request.body.role !== owner &&
              request.body.role !== manager &&
              request.body.role !== worker
            ) {
              if (policyContext.state.route.method === "GET") {
                if (request.query.populate) {
                  request.query.populate = {};
                }
                return true;
              }
              return false;
            }
            return false;
          }
        }
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "POST"
        ) {
          await fetchRole();
          if (
            request.body.role !== owner &&
            request.body.role !== manager &&
            request.body.role !== worker
          ) {
            return false;
          }
        }
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "GET"
        ) {
          const roles = await fetchRole();
          const reqRoles = [];
          roles.forEach((role) => {
            if (
              role.type === "restaurant_worker" ||
              role.type === "restaurant_manager" ||
              role.type === "restaurant_owner"
            ) {
              reqRoles.push({ id: role.id });
            }
          });
          request.query.filters = {
            ...request.query.filters,
            role: {
              $or: reqRoles,
            },
          };
        }
        return true;
        break;
      case "restaurant_owner":
        if (
          policyContext.state.route.path === "/users/:id" &&
          (policyContext.state.route.method === "DELETE" ||
            policyContext.state.route.method === "PUT" ||
            policyContext.state.route.method === "GET")
        ) {
          const user = await fetchUser(params.id);
          const self = await fetchUser(policyContext.state.user.id);
          if (
            !user ||
            !user.restaurant ||
            !self ||
            !self.restaurant
          ) {
            throw new PolicyError("Data not found for you!");
          }
          if (
            user.restaurant.id !== self.restaurant.id &&
            user.role.type !== "restaurant_manager" &&
            user.role.type !== "restaurant_worker"
          ) {
            if (policyContext.state.route.method === "GET") {
              if (request.query.populate) {
                request.query.populate = {};
              }
              return true;
            }
            return false;
          }
        }
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "POST"
        ) {
          await fetchRole();
          if (request.body.role !== manager && request.body.role !== worker) {
            return false;
          }
        }
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "GET"
        ) {
          const user = await fetchUser(policyContext.state.user.id);
          if (!user || !user.restaurant) {
            throw new PolicyError("Data not found for you!");
          }
          const roles = await fetchRole();
          const reqRoles = [];
          roles.forEach((role) => {
            if (
              role.type === "restaurant_worker" ||
              role.type === "restaurant_manager"
            ) {
              reqRoles.push({ id: role.id });
            }
          });
          console.log();
          request.query.filters = {
            ...request.query.filters,
            restaurant: { id: user.restaurant.id },
            role: {
              $or: reqRoles,
            },
          };
        }
        return true;
        break;
      case "restaurant_worker":
        if (
          request.query.populate &&
          policyContext.state.route.path !== "/users/me"
          ) {
          request.query.populate = {};
        }
        return true;
        break;
      case "restaurant_manager":
        if (
          policyContext.state.route.path === "/users/:id" &&
          (policyContext.state.route.method === "DELETE" ||
            policyContext.state.route.method === "PUT" ||
            policyContext.state.route.method === "GET")
        ) {
          const user = await fetchUser(params.id);
          const self = await fetchUser(policyContext.state.user.id);
          if (
            !user ||
            !user.restaurant ||
            !self ||
            !self.restaurant
          ) {
            throw new PolicyError("Data not found for you!");
          }
          if (
            user.restaurant.id !== self.restaurant.id &&
            (user.role.type !== "restaurant_manager" ||
              user.role.type !== "restaurant_worker")
          ) {
            if (policyContext.state.route.method === "GET") {
              if (request.query.populate) {
                request.query.populate = {};
              }
              return true;
            }
            return false;
          }
        }
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "POST"
        ) {
          await fetchRole();
          if (request.body.role !== worker) {
            return false;
          }
        }
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "GET"
        ) {
          const user = await fetchUser(policyContext.state.user.id);
          if (!user || !user.restaurant) {
            throw new PolicyError("Data not found for you!");
          }
          const roles = await fetchRole();
          const reqRoles = [];
          roles.forEach((role) => {
            if (role.type === "restaurant_worker") {
              reqRoles.push({ id: role.id });
            }
          });
          request.query.filters = {
            ...request.query.filters,
            restaurant: { id: user.restaurant.id },
            role: {
              $or: reqRoles,
            },
          };
        }
        return true;
        break;

      default:
        return true;
        break;
    }
  }
  if (
    policyContext.state.route.path === "/users" &&
    policyContext.state.route.method === "POST"
  ) {
    await fetchRole();
    if (request.body.role !== customer) {
      throw new PolicyError("You can not create this!");
    }
    return true;
  }
  if (
    (policyContext.state.route.path === "/users" || policyContext.state.route.path === "/users/:id") &&
    policyContext.state.route.method === "GET"
  ) {
    if (request.query.populate) {
      request.query.populate = {
        role: false,
        restaurants: true,
        orders: false,
      };
    }
    return true;
  }
  // return true;
};
