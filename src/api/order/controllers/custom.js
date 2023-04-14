const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  // Create new order
  async createOrder(ctx) {
    // console.log("---------->",ctx.state.user)

    console.log(ctx.request.body.data);
    // Get request body parameters
    const { restaurant, customer } = ctx.request.body.data;

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
    // Check if customer exists or not
    const existedCustomer = await strapi.db
      .query("api::customer.customer")
      .findOne({
        where: { id: customer },
        populate: true,
      });
    if (!existedCustomer) {
      return (ctx.status = 400), (ctx.body = "Customer not not found");
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
  async getOrder(ctx) {
    return ctx;
  },
  async getOneOrder(ctx) {
    return ctx;
  },
}));
