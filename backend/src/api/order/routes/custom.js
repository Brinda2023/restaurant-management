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
        policies: ["global::isCustomer","global::isAuthenticated"],
      },
    },
    {
      method: "GET",
      path: "/orders/:id",
      handler: "order.findOne",
      config: {
        policies: ["global::isCustomer","global::isAuthenticated"],
      },
    },
    {
      method: "PUT",
      path: "/orders/:id",
      handler: "order.update",
      config: {
        policies: ["global::isCustomer","global::isAuthenticated"],
      },
    },
    {
      method: "DELETE",
      path: "/orders/:id",
      handler: "order.delete",
      config: {
        policies: ["global::isCustomer","global::isAuthenticated"],
      },
    },
  ],
};
