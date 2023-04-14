const { createCoreController } = require("@strapi/strapi").factories;
const accountSid = "ACeb1e6baea4ec1455ece920426e33ad3e"; // Your Account SID from www.twilio.com/console
const authToken = "c6f885fe5693cb6f782d991c69ba7433"; // Your Auth Token from www.twilio.com/console
const client = require("twilio")(accountSid, authToken);

module.exports = createCoreController(
  "api::customer.customer",
  ({ strapi }) => ({
    // Login customer using otp
    async loginCustomer(ctx) {
      console.log(ctx.request.body.data);
      // Get request body data
      const { phone, email } = ctx.request.body.data;
      // check if customer exists or not
      const existedCustomer = await strapi.db
        .query("api::customer.customer")
        .findOne({
          where: { email, phone },
        });
      if (!existedCustomer) {
        return ctx.send({
          status: 404,
          message: "Customer is not registered!",
        });
      }
      //generate otp
      existedCustomer.otp = Math.floor(100000 + Math.random() * 900000);
      // Update customer otp
      await strapi.db.query("api::customer.customer").update({
        where: { email, phone },
        data: {
          otp: existedCustomer.otp,
        },
      });
      // Send email with nodemailer
      await strapi.plugins["email"].services.email.send({
        to: email,
        from: "hello@zignuts.com", //e.g. single sender verification in SendGrid
        subject: "welcome email otp",
        html: `<p>hi ${existedCustomer.username}, this is your otp ${existedCustomer.otp}</p>`,
      });
      // Send OTP with twilio
      await client.messages
        .create({
          body:
            "Hi " +
            existedCustomer.username +
            " this is your OTP " +
            existedCustomer.otp,
          from: "+15076876385", // From a valid Twilio number
          to: "+916354434483",
        })
        .then((message) => console.log(message.sid));
      return existedCustomer;
    },

    // Verify customer otp
    async verifyOtp(ctx) {
      console.log(ctx.request.body.data);
      // Get request body data
      const { email, otp } = ctx.request.body.data;
      // check if customer exists or not
      const existedCustomer = await strapi.db
        .query("api::customer.customer")
        .findOne({
          where: { email },
        });
      console.log(existedCustomer);
      if (!existedCustomer) {
        return (ctx.status = 400), (ctx.body = "Customer is not registered!");
      }
      if (existedCustomer.otp !== otp) {
        return (ctx.status = 403), (ctx.body = "Incorrect OTP!");
      }
      //generate jwt token
      existedCustomer.token = strapi.plugins[
        "users-permissions"
      ].services.jwt.issue({
        email: email,
      });
      // Update customer jwt token
      await strapi.db.query("api::customer.customer").update({
        where: { email },
        data: {
          token: existedCustomer.token,
        },
      });
      return existedCustomer;
    },

    // Logout customer
    async logoutCustomer(ctx) {
      console.log(ctx.request.query.data);
      // Get request body data
      const { id } = ctx.request.params.data;
      // check if customer exists or not
      const existedCustomer = await strapi.db
        .query("api::customer.customer")
        .findOne({
          where: { id },
        });
      if (!existedCustomer) {
        return (ctx.status = 400), (ctx.body = "Customer doesn't exist!");
      }
      if (existedCustomer.token === "" || existedCustomer.otp === "") {
        return (ctx.status = 403), (ctx.body = "Customer is not login!");
      }
      // Update customer jwt token & otp
      await strapi.db.query("api::customer.customer").update({
        where: { email, phone },
        data: {
          token: "",
          otp: "",
        },
      });
      return existedCustomer;
    },
  })
);