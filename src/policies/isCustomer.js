const jwt = require("jsonwebtoken");

module.exports = async (ctx, next) => {
  // Get token from headers
  console.log(ctx.request.headers.token);
  const token = ctx.request.headers.token;
  if (!token) {
    return (ctx.status = 403), (ctx.body = "Customer token not found");
  }
  console.log(token);

  // Verify the JWT token
  const decoded = await strapi.plugins["users-permissions"].services.jwt.verify(
    token
  );
  //   if there is no decodedToken returned, ie invalid or expired token was passed
  if (!decoded) {
    return (ctx.status = 403), (ctx.body = "Invalid token");
  }
  ctx.req.decodedToken = decoded;
  console.log(ctx.req.decodedToken);

  const customer = await strapi.db
    .query("api::customer.customer")
    .findOne({ email: decoded.email });
  // if there is no user with given id OR the token is not matching with the one stored in the database
  if (!customer || customer.token !== token) {
    return (ctx.status = 403), (ctx.body = "Invalid token");
  }
  ctx.req.me = customer;
  console.log(ctx.req.me);
  return;
};
