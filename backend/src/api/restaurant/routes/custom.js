module.exports = {
  routes: [
    {
      method: "POST",
      path: "/restaurants",
      handler: "restaurant.create",
      config: {
        policies: [
          "global::isUser",
          "global::isRestaurant",
          "global::isAuthenticated",
        ],
      },
    },
    {
      method: "PUT",
      path: "/restaurants/:id",
      handler: "restaurant.update",
      config: {
        policies: [
          "global::isUser",
          "global::isRestaurant",
          "global::isAuthenticated",
        ],
      },
    },
    {
      method: "DELETE",
      path: "/restaurants/:id",
      handler: "restaurant.delete",
      config: {
        policies: [
          "global::isUser",
          "global::isRestaurant",
          "global::isAuthenticated",
        ],
      },
    },
  ],
};