const FastifyAuth = require("fastify-auth");

// const User = require("../model/user.model.db");
const userHandler = require("../controllers/users.controller");

const auth = require("../utils/auth");
const verifyToken = require("../utils/verifyToken");

const usersRoutes = async (fastify, opts) => {
  fastify
    .decorate("asyncVerifyJWT", verifyToken)
    .decorate("asyncVerifyUsernameAndPassword", auth)
    .register(FastifyAuth)
    .after(() => {
      fastify.route({
        method: ["POST"],
        url: "/register",
        logLevel: "warn",
        handler: userHandler.create,
      });
      // login route
      fastify.route({
        method: ["POST"],
        url: "/login",
        logLevel: "warn",
        preHandler: fastify.auth([fastify.asyncVerifyUsernameAndPassword]),
        handler: userHandler.login,
      });

      // proifle route
      fastify.route({
        method: ["GET"],
        url: "/profile",
        logLevel: "warn",
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: userHandler.profile,
      });

      // logout route
      fastify.route({
        method: ["POST"],
        url: "/logout",
        logLevel: "warn",
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: userHandler.logout,
      });
    });
};
module.exports = usersRoutes;
