const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({

  // Create Order at frontend side
  async customCreate(ctx) {
    try {
      const userId = ctx.req.me.id;
      const { restaurant, items } = ctx.request.body.data;
      // Create new order
      const newOrder = await strapi.db.query("api::order.order").create({
        data: {
          restaurant: parseInt(restaurant),
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

  // Create new order
  async createOrder(ctx) {
    // console.log("---------->",ctx.state.user)
    console.log(ctx.request.body.data);
    console.log(ctx.req.decodedToken);
    console.log(ctx.req.me);
    // Get request body parameters
    const { restaurant, customer } = ctx.request.body.data;
    // Check if customer is login or not
    if (customer[0] !== ctx.req.me.id) {
      return (ctx.status = 400), (ctx.body = "Customer is not login");
    }
    // Check if restaurant exists or not
    const existedResturant = await strapi.db
      .query("api::restaurant.restaurant")
      .findOne({
        where: { id: restaurant },
        populate: true,
      });
    if (!existedResturant) {
      return (ctx.status = 400), (ctx.body = "Restaurant not found");
    }
    if (existedResturant.status === "Closed") {
      return (ctx.status = 400), (ctx.body = "Restaurant is Closed");
    }
    // Create new order
    const entry = await strapi.db
      .query("api::order.order")
      .create({
        data: {
          totalAmount: 0,
          totalQuantity: 0,
          status: "Placed",
          restaurant: restaurant,
          customer: customer,
        },
      })
      .then(async (res) => {
        return ctx.send(res);
      })
      .catch((error) => {
        console.log(error);
        return (ctx.status = 400);
      });
    // After creating order give relation between customer & restaurant
    const customers = existedResturant.customers.map((customer) => {
      return customer.id;
    });
    await strapi.db.query("api::restaurant.restaurant").update({
      where: { id: restaurant },
      data: { customers: [...customers, ...customer] },
    });
    return entry;
  },

  // Get all the orders of current user
  async getOrder(ctx) {
    const customer = await strapi.db
      .query("api::customer.customer")
      .findOne({ id: ctx.req.me.id, populate: true });
    console.log(customer.orders);
    return { customer: { name: customer.username }, order: customer.orders };
  },
}));
