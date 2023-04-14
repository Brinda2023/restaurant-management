module.exports = {
    routes: [
      {
        method: "POST",
        path: "/customers/login",
        handler: "custom.loginCustomer",
      },
      {
        method: "POST",
        path: "/customers/logout",
        handler: "custom.logoutCustomer",
      },
      {
        method: "POST",
        path: "/customers/verify",
        handler: "custom.verifyOtp",
      },
    ],
  };