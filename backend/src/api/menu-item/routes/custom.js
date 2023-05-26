module.exports = {
  routes: [
    {
      method: "GET",
      path: "/menu-items",
      handler: "menu-item.find",
      config: {
        policies: [
          "global::isAuthenticated",
        ],
      },
    },
    {
      method: "GET",
      path: "/menu-items/:id",
      handler: "menu-item.findOne",
      config: {
        policies: [
          "global::isAuthenticated",
        ],
      },
    },
    {
      method: "POST",
      path: "/menu-items",
      handler: "menu-item.create",
      config: {
        policies: [
          "global::isUser",
          "global::isMenu-item",
          "global::isAuthenticated",
        ],
      },
    },
    {
      method: "PUT",
      path: "/menu-items/:id",
      handler: "menu-item.update",
      config: {
        policies: [
          "global::isUser",
          "global::isMenu-item",
          "global::isAuthenticated",
        ],
      },
    },
    {
      method: "DELETE",
      path: "/menu-items/:id",
      handler: "menu-item.delete",
      config: {
        policies: [
          "global::isUser",
          "global::isMenu-item",
          "global::isAuthenticated",
        ],
      },
    },
  ],
};
