module.exports = async (ctx, next) => {
  const user = ctx.req.me;
  console.log(user);
  const role = ctx.req.role;
  if (role === 'authenticated') {
    return true;
  }

  const restaurantId = ctx.request.params.id;
  console.log(user.restaurant.id);
  if (user.restaurant.id !== parseInt(restaurantId)) {
    return false;
  }
  console.log("Policies Done!");
  return;
};
