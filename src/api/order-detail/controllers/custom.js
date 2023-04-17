const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::order-detail.order-detail",
  ({ strapi }) => ({
    // Create order details
    async createOrderDetails(ctx) {
      console.log(ctx.request.body.data);
      // Get request body data
      const { quantity, order, menuItem } = ctx.request.body.data;

      // Check if menu item exists or not
      const existedMenuItem = await strapi.entityService.findOne(
        "api::menu-item.menu-item",
        menuItem,
        {}
      );
      if (!existedMenuItem) {
        return (ctx.status = 400), (ctx.body = "Menu Item not found");
      }
      // check if order exists or not
      const existedOrder = await strapi.db.query("api::order.order").findOne({
        where: { id: order },
        populate: true,
      });
      if (!existedOrder) {
        return (ctx.status = 400), (ctx.body = "Order not found");
      }

      // count total price of current menu item
      const total = existedMenuItem.price * quantity;
      // Create new order-detail
      const entry = await strapi.db
        .query("api::order-detail.order-detail")
        .create({
          data: {
            quantity: quantity,
            order: order,
            menuItem: menuItem,
            total,
            price: existedMenuItem.price,
          },
        })
        .then((res) => {
          return ctx.send(res);
        })
        .catch((error) => {
          console.log(error);
          return (ctx.status = 400);
        });

      // Update order according to created order details
      await strapi.db.query("api::order.order").update({
        where: { id: order },
        data: {
          totalQuantity: existedOrder.totalQuantity + quantity,
          totalAmount: existedOrder.totalAmount + total,
        },
      });
      return entry;
    },

    async deleteOrderDetails(ctx) {
      // Get request body data
      const id = ctx.request.params.id;
      console.log(id);
      // Check if order detail exists or not
      const existedOrderDetail = await strapi.db
        .query("api::order-detail.order-detail")
        .findOne({ where: { id: id }, populate: true });
      if (!existedOrderDetail) {
        return (ctx.status = 400), (ctx.body = "Order Detail not found");
      }
      console.log(existedOrderDetail);
      await strapi.db.query("api::order.order").update({
        where: { id: existedOrderDetail.order.id },
        data: {
          totalQuantity:
            existedOrderDetail.order.totalQuantity -
            existedOrderDetail.quantity,
          totalAmount:
            existedOrderDetail.order.totalAmount -
            existedOrderDetail.menuItem.price,
        },
      });
      // Delete order-detail
      const deletedOrderDetail = await strapi.db
        .query("api::order-detail.order-detail")
        .delete({
          where: { id: existedOrderDetail.id },
        })
        .then((res) => {
          return ctx.send(res);
        })
        .catch((error) => {
          console.log(error);
          return (ctx.status = 400);
        });
      return deletedOrderDetail;
    },
  })
);
