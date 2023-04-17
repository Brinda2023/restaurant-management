const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
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
    if (existedResturant.status==="Closed") {
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
  async getOrder(ctx) {
    const customer = await strapi.db
      .query("api::customer.customer")
      .findOne({ id: ctx.req.me.id , populate: true });
    console.log(customer.orders);
    return { customer: { name: customer.username }, order: customer.orders };
  },
}));
