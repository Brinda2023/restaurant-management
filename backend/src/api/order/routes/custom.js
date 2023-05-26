module.exports = {
  routes: [
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
      handler: "order.find",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
  ],
};
