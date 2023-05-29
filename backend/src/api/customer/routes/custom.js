module.exports = {
  routes: [
    {
      method: "POST",
      path: "/customers/login",
      handler: "custom.loginCustomer",
    },
    {
      method: "POST",
      path: "/customers/verify",
      handler: "custom.verifyOtp",
    },
    {
      method: "POST",
      path: "/customers/logout",
      handler: "custom.logoutCustomer",
      config: {
        policies: ["global::isCustomer"],
      },
    },
    {
      method: "PUT",
      path: "/customers/:id",
      handler: "customer.update",
      config: {
        policies: ["global::isCustomer","global::isAuthenticated"],
      },
    },
  ],
};
