module.exports = {
    routes: [
      {
        method: "POST",
        path: "/orders",
        handler: "custom.createOrder",
      },
    ],
  };