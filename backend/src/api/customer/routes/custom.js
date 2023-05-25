module.exports = {
  routes: [
    {
      method: "POST",
      path: "/customers/login",
      handler: "custom.loginCustomer",
      config: {
        policies: ["global::isAuthenticated"],
      },
    },
    {
      method: "POST",
      path: "/customers/verify",
      handler: "custom.verifyOtp",
      config: {
        policies: ["global::isAuthenticated"],
      },
    },
    {
      method: "POST",
      path: "/customers/logout",
      handler: "custom.logoutCustomer",
      config: {
        policies: ["global::isCustomer", "global::isAuthenticated"],
      },
    },
  ],
};
