module.exports = {
  routes: [
    {
      method: "POST",
      path: "/order-details",
      handler: "custom.createOrderDetails",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
    {
      method: "DELETE",
      path: "/order-details/:id",
      handler: "custom.deleteOrderDetails",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
  ],
};
