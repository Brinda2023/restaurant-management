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
      method: "GET",
      path: "/order-details",
      handler: "custom.getOrderDetails",
      config: {
        policies: ["global::isCustomer"],
      },
    },
    {
      method: "GET",
      path: "/order-details/:id",
      handler: "custom.getOneOrderDetails",
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
  ],
};
