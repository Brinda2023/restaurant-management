module.exports = async (ctx, next) => {
  const user = ctx.req.me;
  console.log(user);
  const role = ctx.req.role;
  if (role === "authenticated") {
    return true;
  }

  const menuItemId = ctx.request.params.id;
  console.log(user.restaurant.id);

  const menuItem = await strapi.db
    .query("api::menu-item.menu-item")
    .findOne({ where: { id: menuItemId }, populate: true });
  console.log(menuItem);

  const category = await strapi.db
    .query("api::category.category")
    .findOne({ where: { id: menuItem.category.id }, populate: true });
  console.log(category);

  if (user.restaurant.id !== category.restaurant.id) {
    return false;
  }
  console.log("Policies Done!");
  return;
};
