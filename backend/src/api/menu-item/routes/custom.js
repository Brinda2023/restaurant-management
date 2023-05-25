module.exports = {
  routes: [
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
