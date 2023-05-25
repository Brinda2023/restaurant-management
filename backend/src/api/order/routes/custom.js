module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders",
      handler: "custom.createOrder",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
    {
      method: "POST",
      path: "/restaurant/orders",
      handler: "custom.customCreate",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
    {
      method: "GET",
      path: "/orders",
      handler: "custom.getOrder",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
  ],
};
