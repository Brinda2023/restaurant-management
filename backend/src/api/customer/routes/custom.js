module.exports = {
  //add polices for restricted Accessibility. in all the default and custom routers.
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
        policies: ["global::isCustomer","global::isAuthenticated"],
      },
    },
    {
      method: "DELETE",
      path: "/customers/:id",
      handler: "customer.delete",
      config: {
        policies: ["global::isCustomer","global::isAuthenticated"],
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
    {
      method: "GET",
      path: "/customers",
      handler: "customer.find",
      config: {
        policies: ["global::isCustomer","global::isAuthenticated"],
      },
    },
    {
      method: "GET",
      path: "/customers/:id",
      handler: "customer.findOne",
      config: {
        policies: ["global::isCustomer","global::isAuthenticated"],
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
