module.exports = {
  routes: [
    {
      method: "POST",
      path: "/categories",
      handler: "category.create",
      config: {
        policies: [
          "global::isAuthenticated",
        ],
      },
    },
    {
      method: "PUT",
      path: "/categories/:id",
      handler: "category.update",
      config: {
        policies: [
          "global::isAuthenticated",
        ],
      },
    },
    {
      method: "DELETE",
      path: "/categories/:id",
      handler: "category.delete",
      config: {
        policies: [
          "global::isAuthenticated",
        ],
      },
    },
    {
      method: "GET",
      path: "/categories/:id",
      handler: "category.findOne",
      config: {
        policies: [
          "global::isAuthenticated",
        ],
      },
    },
    {
      method: "GET",
      path: "/categories",
      handler: "category.find",
      config: {
        policies: [
          "global::isAuthenticated",
        ],
      },
    },
  ],
};
