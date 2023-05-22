module.exports = async (ctx, next) => {
  const user = ctx.req.me;
  console.log(user);
  const role = ctx.req.role;
  if (role === 'authenticated') {
    return true;
  }

  const categoryId = ctx.request.params.id;
  console.log(user.restaurant.id);

  const category = await strapi.db
    .query("api::category.category")
    .findOne({ where: { id: categoryId }, populate: true });
  console.log(category);

  if (user.restaurant.id !== category.restaurant.id) {
    return false;
  }
  console.log("Policies Done!");
  return;
};
