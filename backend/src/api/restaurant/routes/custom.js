module.exports = {
    routes: [
      {
        method: "PUT",
        path: "/restaurants/:id",
        handler: "restaurant.update",
        config: {
          policies: ["global::isUser","global::isRestaurant"],
        },
      },
    ],
  };
  