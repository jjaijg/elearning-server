const FastifyAuth = require("fastify-auth");

const semesterSchm = require("../response-schema/semester.schema");
const semesterCtrl = require("../controllers/semesters.controller");

const auth = require("../utils/auth");
const verifyToken = require("../utils/verifyToken");

const semesterRoutes = async (fastify, opts) => {
  fastify
    .decorate("asyncVerifyJWT", verifyToken)
    .decorate("asyncVerifyUsernameAndPassword", auth)
    .register(FastifyAuth)
    .after(() => {
      // Get all semesters with related dept
      fastify.route({
        method: ["GET"],
        url: "/semesters/with-dept",
        logLevel: "warn",
        handler: semesterCtrl.fetchWithDept,
      });
      // Get all semesters with related dept
      fastify.route({
        method: ["GET"],
        url: "/semesters/dept/:department",
        logLevel: "warn",
        handler: semesterCtrl.fetch,
      });

      // Get semester by id
      fastify.route({
        method: ["GET"],
        url: "/semesters/:id",
        schema: semesterSchm.getSemesterSchm,
        handler: semesterCtrl.get,
      });

      //   create a semester
      fastify.route({
        method: ["POST"],
        url: "/semesters",
        schema: semesterSchm.postSemesterSchm,
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: semesterCtrl.create,
      });

      //   update a semester
      fastify.route({
        method: ["PUT"],
        url: "/semesters/:id",
        schema: semesterSchm.updSemesterSchm,
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: semesterCtrl.update,
      });

      //   delete a semester
      fastify.route({
        method: ["DELETE"],
        url: "/semesters/:id",
        schema: semesterSchm.delSemesterSchm,
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: semesterCtrl.delete,
      });
    });
};

module.exports = semesterRoutes;
