module.exports = {
  async afterCreate(event) {
    const restaurantId = event.result.id;
    const username = event.params.data.username;
    const email = event.params.data.email;
    const password = event.params.data.password;
    await strapi.plugins["users-permissions"].services.user.add({
      username,
      email,
      password,
      provider: "local",
      role: 6,
      restaurant: restaurantId,
    });
  },
};
