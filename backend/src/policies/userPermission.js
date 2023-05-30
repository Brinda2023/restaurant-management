const utils = require("@strapi/utils");
const { PolicyError } = utils.errors;
module.exports = async (policyContext, config, { strapi }) => {
  let { params, request } = policyContext;

  // Fetch User
  const fetchUser = async (id) => {
    return await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { id }, populate: true });
  };

  let manager;
  let worker;
  let owner;

  // Fetch Role and get role id of all roles
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

  // Check policies for different roles
  if (policyContext.state.user) {
    switch (policyContext.state.user.role.type) {
      // Check policy for authenticated - Super Admin
      case "authenticated":
        // If path contains user id and method is Update , Get or Delete
        if (
          policyContext.state.route.path === "/users/:id" &&
          (policyContext.state.route.method === "DELETE" ||
            policyContext.state.route.method === "PUT" ||
            policyContext.state.route.method === "GET")
        ) {
          // Fetch role
          await fetchRole();

          // Stop populate for GET method when login user is not owner, manager or worker
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
        }

        //If path contains users and method is POST
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "POST"
        ) {
          // Fetch role
          await fetchRole();
          // if role is not owner manager or worker then he can't create user
          if (
            request.body.role !== owner &&
            request.body.role !== manager &&
            request.body.role !== worker
          ) {
            return false;
          }
        }

        // If path contains users and method is GET
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "GET"
        ) {
          // Fetch role
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

      // Check policies for Restaurant Owner
      case "restaurant_owner":
        // if path is users id and method is Update, Get and Delete
        if (
          policyContext.state.route.path === "/users/:id" &&
          (policyContext.state.route.method === "DELETE" ||
            policyContext.state.route.method === "PUT" ||
            policyContext.state.route.method === "GET")
        ) {
          // Fetch user and fetch current login user
          const user = await fetchUser(params.id);
          const self = await fetchUser(policyContext.state.user.id);
          // is user and his restaurant not found then throw error
          if (!user || !user.restaurant || !self || !self.restaurant) {
            throw new PolicyError("Data not found for you!");
          }
          // if restaurant id doesn't match and role is not owner or manager then
          if (
            user.restaurant.id !== self.restaurant.id &&
            user.role.type !== "restaurant_manager" &&
            user.role.type !== "restaurant_worker"
          ) {
            // if method is GET then stop populate
            if (policyContext.state.route.method === "GET") {
              if (request.query.populate) {
                request.query.populate = {};
              }
              return true;
            }
            return false;
          }
        }
        // if path is users and method is POST
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "POST"
        ) {
          // Fetch role
          await fetchRole();
          // stop this route if role is not manager or worker
          if (request.body.role !== manager && request.body.role !== worker) {
            return false;
          }
        }
        //if path is users and method is GET
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "GET"
        ) {
          // Fetch user
          const user = await fetchUser(policyContext.state.user.id);
          // is user or user's restaurant not found then throw error
          if (!user || !user.restaurant) {
            throw new PolicyError("Data not found for you!");
          }
          //Fetch roles
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

      // Check policies for Restaurant Worker
      case "restaurant_worker":
        // if path is not user/me and wants to populate then stop populate
        if (
          request.query.populate &&
          policyContext.state.route.path !== "/users/me"
        ) {
          request.query.populate = {};
        }
        return true;
        break;

      // Check policies for Restaurant Manager
      case "restaurant_manager":
        //if path is users id and method is UPDATE, DELETE and GET
        if (
          policyContext.state.route.path === "/users/:id" &&
          (policyContext.state.route.method === "DELETE" ||
            policyContext.state.route.method === "PUT" ||
            policyContext.state.route.method === "GET")
        ) {
          // Fetch user & fetch login user
          const user = await fetchUser(params.id);
          const self = await fetchUser(policyContext.state.user.id);
          // if user is not found or user's restaturant is not found then throw error
          if (!user || !user.restaurant || !self || !self.restaurant) {
            throw new PolicyError("Data not found for you!");
          }
          // if current login user's restaurant id is not equals to params user's restaurant and user is not manager or worker
          if (
            user.restaurant.id !== self.restaurant.id &&
            (user.role.type !== "restaurant_manager" ||
              user.role.type !== "restaurant_worker")
          ) {
            // then stop populate for GET method
            if (policyContext.state.route.method === "GET") {
              if (request.query.populate) {
                request.query.populate = {};
              }
              return true;
            }
            return false;
          }
        }
        // if path is users and method is POST
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "POST"
        ) {
          // Fetch role
          await fetchRole();
          // return false if role is not worker
          if (request.body.role !== worker) {
            return false;
          }
        }
        // if path is users and method is GET
        if (
          policyContext.state.route.path === "/users" &&
          policyContext.state.route.method === "GET"
        ) {
          //Fetch current login user
          const user = await fetchUser(policyContext.state.user.id);
          // if user not found or user's restaurant not found
          if (!user || !user.restaurant) {
            throw new PolicyError("Data not found for you!");
          }
          // Fetch roles
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
  // if path is users or users id and method is GET
  if (
    (policyContext.state.route.path === "/users" ||
      policyContext.state.route.path === "/users/:id") &&
    policyContext.state.route.method === "GET"
  ) {
    // populate restaurants only
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
