"use strict";

/**
 * order-detail controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::order-detail.order-detail",
  ({ strapi }) => ({
    // Create order details
    async create(ctx) {
      // Get request body data
      const { quantity, order, menuItem } = ctx.request.body.data;

      // check if order exists or not
      const existedOrder = await strapi.db.query("api::order.order").findOne({
        where: { id: order },
        populate: true,
      });
      if (!existedOrder || existedOrder.status === "Complete") {
        return (ctx.status = 400), (ctx.body = "Order not found");
      }
      // Check if menu item exists or not
      let existedMenuItem = (
        await strapi.db
          .query("api::menu-item.menu-item")
          .findMany({
            where: {
              category: {
                id: {
                  $in: (
                    await strapi.db
                      .query("api::restaurant.restaurant")
                      .findOne({
                        where: { id: existedOrder.restaurant.id },
                        populate: true,
                      })
                  ).categories.map((cat) => cat.id),
                },
              },
            },
            select: ["id"],
          })
          .then((item) => {
            return item.map((item) => item.id);
          })
      ).includes(parseInt(menuItem));
      if (!existedMenuItem) {
        return (ctx.status = 400), (ctx.body = "Menu Item not found");
      }

      existedMenuItem = await strapi.db
        .query("api::menu-item.menu-item")
        .findOne({
          where: { id: menuItem },
          populate: true,
        });

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

    // Delete an order detail from order
    async delete(ctx) {
      // Get request body data
      const id = ctx.request.params.id;
      // Check if order detail exists or not
      const existedOrderDetail = await strapi.db
        .query("api::order-detail.order-detail")
        .findOne({ where: { id: id }, populate: true });
      if (!existedOrderDetail) {
        return (ctx.status = 400), (ctx.body = "Order Detail not found");
      }
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
          return (ctx.status = 400);
        });
      return deletedOrderDetail;
    },

    // Update an order detail from order
    async update(ctx) {
      // Get request body data
      const id = ctx.request.params.id;
      // Get request body data
      const { quantity } = ctx.request.body.data;

      // Check if order detail exists or not
      const existedOrderDetail = await strapi.db
        .query("api::order-detail.order-detail")
        .findOne({ where: { id: id }, populate: true });
      if (!existedOrderDetail) {
        return (ctx.status = 400), (ctx.body = "Order Detail not found");
      }
      // Update order
      const updatedOrderDetail = await strapi.db
        .query("api::order-detail.order-detail")
        .update({
          where: { id: id },
          data: {
            quantity,
            total: quantity * existedOrderDetail.price,
          },
        });

      // Update order-detail
      const updatedOrder = await strapi.db.query("api::order.order").update({
        where: { id: existedOrderDetail.order.id },
        data: {
          totalQuantity:
            existedOrderDetail.order.totalQuantity -
            existedOrderDetail.quantity +
            quantity,
          totalAmount:
            existedOrderDetail.order.totalAmount -
            existedOrderDetail.total +
            updatedOrderDetail.total,
        },
      });
      return updatedOrderDetail;
    },
  })
);
