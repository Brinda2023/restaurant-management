const jwt = require("jsonwebtoken");

module.exports = async (ctx, next) => {
  // Get token from headers
  console.log(ctx.request.headers.authorization);
  const token = ctx.request.headers.authorization.split(" ")[1];
  if (!token) {
    // return (ctx.status = 403), (ctx.body = "User token not found");
    return false;
  }
  console.log(token);

  // Verify the JWT token
  const decoded = await strapi.plugins["users-permissions"].services.jwt.verify(
    token
  );
  //   if there is no decodedToken returned, ie invalid or expired token was passed
  if (!decoded) {
    // return (ctx.status = 403), (ctx.body = "Invalid token");
    return false;
  }
  ctx.req.decodedToken = decoded;
  console.log(ctx.req.decodedToken);

  const user = await strapi.db
    .query("plugin::users-permissions.user")
    .findOne({ where: { id: decoded.id }, populate: true });
  // if there is no user with given id OR the token is not matching with the one stored in the database
  if (!user) {
    // return (ctx.status = 403), (ctx.body = "Invalid token");
    return false;
  }
  ctx.req.me = user;
  console.log(ctx.req.me);
  ctx.req.role = user.role.type;
  return;
};
