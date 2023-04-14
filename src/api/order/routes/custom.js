module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders",
      handler: "custom.createOrder",
      config: {
        policies: ["global::isCustomer"],
      },
    },
    {
      method: "GET",
      path: "/orders",
      handler: "custom.getOrder",
      config: {
        policies: ["global::isCustomer"],
      },
    },
    {
      method: "GET",
      path: "/orders/:id",
      handler: "custom.getOneOrder",
      config: {
        policies: ["global::isCustomer"],
      },
    },
  ],
};
