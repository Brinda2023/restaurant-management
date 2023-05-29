module.exports = async (policyContext, config, { strapi }) => {
  let { params, request } = policyContext;
  console.log(request.header.token.id);
  if (params.id) {
    console.log("here");
    if (
      (
        await strapi.db
          .query("api::order.order")
          .findMany({
            where: {
              customer: { id: request.header.token.id },
            },
            select: ["id"],
          })
          .then((item) => {
            return item.map((item) => item.id);
          })
      ).includes(parseInt(params.id))
    ) {
      return true;
    } else {
      throw new PolicyError("Data not found!");
    }
  }else{
    request.query.filters = {
      ...request.query.filters,
      customer: { id: request.header.token.id },
    };
  }
  return;
};
