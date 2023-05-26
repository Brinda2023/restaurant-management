module.exports = (plugin) => {
  for (let i = 0; i < plugin.routes["content-api"].routes.length; i++) {
    const route = plugin.routes["content-api"].routes[i];
    // count route
    if (route.path == "/users") {
      plugin.routes["content-api"].routes[i] = {
        ...route,
        config: {
          ...route.config,
          policies: ["global::userPermission"],
        },
      };
    }
    if (route.path == "/users/:id") {
      plugin.routes["content-api"].routes[i] = {
        ...route,
        config: {
          ...route.config,
          policies: ["global::userPermission"],
        },
      };
    }
    if (route.path == "/users/me") {
      plugin.routes["content-api"].routes[i] = {
        ...route,
        config: {
          ...route.config,
          policies: ["global::userPermission"],
        },
      };
    }
  }
  return plugin;
};
