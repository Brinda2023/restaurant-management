module.exports = {
  routes: [
    {
      method: "POST",
      path: "/order-details",
      handler: "order-detail.create",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
    {
      method: "DELETE",
      path: "/order-details/:id",
      handler: "order-detail.delete",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
    {
      method: "GET",
      path: "/order-details",
      handler: "order-detail.find",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
    {
      method: "GET",
      path: "/order-details/:id",
      handler: "order-detail.findOne",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
    {
      method: "PUT",
      path: "/order-details/:id",
      handler: "order-detail.update",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
  ],
};
