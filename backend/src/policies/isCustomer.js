module.exports = async (ctx, next) => {
  // Get token from headers
  // if (
  //   ctx.request.body.data &&
  //   (!ctx.request.body.data.items || !ctx.request.body.data.items.length)
  // ) {
  //   return (ctx.status = 400), (ctx.body = "Items are not selected!");
  // }
  if (ctx.request.headers.token) {
    const token = ctx.request.headers.token;
    if (!token) {
      return (ctx.status = 403), (ctx.body = "Customer token not found");
    }

    // Verify the JWT token
    const decoded = await strapi.plugins[
      "users-permissions"
    ].services.jwt.verify(token);
    //   if there is no decodedToken returned, ie invalid or expired token was passed
    if (!decoded) {
      return (ctx.status = 403), (ctx.body = "Invalid token");
    }
    ctx.req.decodedToken = decoded;

    const customer = await strapi.db
      .query("api::customer.customer")
      .findOne({ where: { email: decoded.email } });
    // if there is no user with given id OR the token is not matching with the one stored in the database
    if (!customer || customer.token !== token) {
      return (ctx.status = 403), (ctx.body = "Invalid token");
    }
    ctx.req.me = customer;
    ctx.request.headers.token = customer;
  }
  console.log("Policy Done!");
  return;
};
