module.exports = {
    routes: [
      {
        method: "PUT",
        path: "/categories/:id",
        handler: "category.update",
        config: {
          policies: ["global::isUser","global::isCategory"],
        },
      },
    ],
  };