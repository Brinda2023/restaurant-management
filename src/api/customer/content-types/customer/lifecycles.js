
module.exports = {
  async beforeCreate(event) {
    event.params.data.token = strapi.plugins[
      "users-permissions"
    ].services.jwt.issue({
      email: event.params.data.email,
    });
    event.params.data.otp = Math.floor(100000 + Math.random() * 900000)
  },
  async afterCreate(event) {
    const { result } = event;
    console.log(result);
    await strapi.plugins["email"].services.email.send({
      to: result.email,
      from: "hello@zignuts.com", //e.g. single sender verification in SendGrid
      subject: "welcome email otp",
      html: `<p>hi ${result.username}, this is your otp ${result.otp}</p>`,
    });
  },
};
