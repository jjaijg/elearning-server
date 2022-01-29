const plugin = require("fastify-plugin");

const dbConnector = async (fastify, options) => {
  fastify.register(require("fastify-mongodb"), {
    url: process.env.MONGODB,
  });
};

module.exports = plugin(dbConnector);
