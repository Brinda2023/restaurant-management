module.exports = {
  routes: [
    {
      method: "POST",
      path: "/order-details",
      handler: "custom.createOrderDetails",
      config: {
        policies: ["global::isCustomer"],
      },
    },
    {
      method: "DELETE",
      path: "/order-details/:id",
      handler: "custom.deleteOrderDetails",
      config: {
        policies: ["global::isCustomer"],
      },
    },
    {
      method: "GET",
      path: "/order-details",
      handler: "custom.find",
      config: {
        policies: ["global::isCustomer","global::isAuthenticated"],
      },
    },
    {
      method: "GET",
      path: "/order-details/:id",
      handler: "custom.findOne",
      config: {
        policies: ["global::isCustomer","global::isAuthenticated"],
      },
    },
  ],
};
