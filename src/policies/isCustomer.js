module.exports = async (ctx, next) => {
  // get the request authorisation header
  const header = ctx.req.headers["authorization"];
  // sails.log.info(header);
  if (!header) {
    return (ctx.status = 403), (ctx.body = "Authorization header not found");
  }
  // get the authentication token assuming Bearer token
  const token = header.split(" ")[1];
  // sails.log.info(token);
  if (!token) {
    return (ctx.status = 403), (ctx.body = "Token not found");
  }
  // Verify the JWT token
  const decoded = await jwt.verify(token, "rjANWoRPr09LY14t2/");
  console.log(decoded);
  //   if there is no decodedToken returned, ie invalid or expired token was passed
  if (!decoded) {
    return (ctx.status = 403), (ctx.body = "Invalid token");
  }
  ctx.req.decodedToken = decoded;

  const customer = await strapi.query("customer").findOne({ id: decoded.id });
  // if there is no user with given id OR the token is not matching with the one stored in the database
  if (!customer || customer.token !== token) {
    return (ctx.status = 403), (ctx.body = "Invalid token");
  }
  ctx.req.me = customer;

  return next();
};
