module.exports = {
    routes: [
      {
        method: "PUT",
        path: "/menu-items/:id",
        handler: "menu-item.update",
        config: {
          policies: ["global::isUser","global::isMenu-item"],
        },
      },
    ],
  };