const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  // Create Order at frontend side
  async customCreate(ctx) {
    try {
      const userId = ctx.req.me.id;
      const { restaurant, items, tableNumber } = ctx.request.body.data;
      // Create new order
      const newOrder = await strapi.db.query("api::order.order").create({
        data: {
          restaurant: parseInt(restaurant),
          tableNumber: parseInt(tableNumber),
          customer: userId,
          totalAmount: 0,
          totalQuantity: 0,
          status: "Placed",
        },
      });
      const orderId = newOrder.id;
      let totalQuantity = 0;
      let totalAmount = 0;
      // for all items exists in cart insert it into database at order-detail
      items.forEach(async (item) => {
        totalAmount += item.quantity * item.price;
        totalQuantity += item.quantity;
        console.log(totalAmount);
        console.log(totalQuantity);
        await strapi.db.query("api::order-detail.order-detail").create({
          data: {
            quantity: item.quantity,
            order: orderId,
            menu_item: item["menu-item"],
            total: item.quantity * item.price,
            price: item.price,
          },
        });
      });
      //  Update order as per order details
      const updateOrder = await strapi.db.query("api::order.order").update({
        where: { id: orderId },
        data: {
          totalQuantity,
          totalAmount,
        },
      });
      return updateOrder;
    } catch (error) {
      return ctx.badRequest(error);
    }
  },

}));
