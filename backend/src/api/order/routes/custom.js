module.exports = {
  routes: [
    {
      method: "POST",
      path: "/restaurant/orders",
      handler: "custom.customCreate",
      config: {
        policies: ["global::isCustomer"],
      },
    },
    {
      method: "GET",
      path: "/orders",
      handler: "order.find",
      config: {
        policies: ["global::isAuthenticated"],
      },
    },
    {
      method: "GET",
      path: "/orders",
      handler: "custom.customFind",
      config: {
        policies: ["global::isCustomer", "global::isOrder"],
      },
    },
    {
      method: "GET",
      path: "/orders/:id",
      handler: "order.findOne",
      config: {
        policies: ["global::isAuthenticated"],
      },
    },
    {
      method: "GET",
      path: "/orders/:id",
      handler: "custom.customFindOne",
      config: {
        policies: ["global::isCustomer", "global::isOrder"],
      },
    },
  ],
};
