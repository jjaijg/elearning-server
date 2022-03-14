// const semesterSchm = require("../response-schema/semester.schema");
const FastifyAuth = require("fastify-auth");

const paperCtrl = require("../controllers/papers.controller");
const { upload, uploadFile } = require("../utils/fileUpload");

const auth = require("../utils/auth");
const verifyToken = require("../utils/verifyToken");

const paperRoutes = async (fastify, opts) => {
  fastify
    .decorate("asyncVerifyJWT", verifyToken)
    .decorate("asyncVerifyUsernameAndPassword", auth)
    .register(FastifyAuth)
    .after(() => {
      // Get all papers
      fastify.route({
        method: ["GET"],
        url: "/papers/all",
        // schema: semesterSchm.getDepartmentsSchm,
        handler: paperCtrl.fetchAll,
      });

      // Get all papers of a semester
      fastify.route({
        method: ["GET"],
        url: "/papers/sem/:semester",
        // schema: semesterSchm.getDepartmentsSchm,
        handler: paperCtrl.fetch,
      });

      // Get paper by id
      fastify.route({
        method: ["GET"],
        url: "/papers/:id",
        // schema: semesterSchm.getSemesterSchm,
        handler: paperCtrl.get,
      });

      //   create a paper
      fastify.route({
        method: ["POST"],
        url: "/papers",
        // schema: semesterSchm.postSemesterSchm,
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: paperCtrl.create,
      });

      //   update a paper
      fastify.route({
        method: ["PUT"],
        url: "/papers/:id",
        // schema: semesterSchm.updSemesterSchm,
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: paperCtrl.update,
      });

      //   delete a paper
      fastify.route({
        method: ["DELETE"],
        url: "/papers/:id",
        // schema: semesterSchm.delSemesterSchm,
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: paperCtrl.delete,
      });

      fastify.route({
        method: ["PUT"],
        url: "/papers/:id/upload",
        preHandler: fastify.auth([fastify.asyncVerifyJWT, uploadFile], {
          run: "all",
        }),
        handler: paperCtrl.addFileToPaper,
      });

      fastify.route({
        method: ["POST"],
        url: "/papers/files/:filename",
        handler: paperCtrl.getFileFromPaper,
      });

      fastify.route({
        method: ["DELETE"],
        url: "/papers/:paperId/del-file",
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: paperCtrl.deleteFileFromPaper,
      });
    });
};

// module.exports = (app) => {
//   // Get all papers
//   app.get("/papers/all", {
//     // schema: semesterSchm.getDepartmentsSchm,
//     handler: paperCtrl.fetchAll,
//   });

//   // Get all papers of a semester
//   app.get("/papers/sem/:semester", {
//     // schema: semesterSchm.getDepartmentsSchm,
//     handler: paperCtrl.fetch,
//   });

//   // Get paper by id
//   app.get("/papers/:id", {
//     // schema: semesterSchm.getSemesterSchm,
//     handler: paperCtrl.get,
//   });

//   //   create a paper
//   app.post("/papers", {
//     // schema: semesterSchm.postSemesterSchm,
//     handler: paperCtrl.create,
//   });

//   //   update a paper
//   app.put("/papers/:id", {
//     // schema: semesterSchm.updSemesterSchm,
//     handler: paperCtrl.update,
//   });

//   //   delete a paper
//   app.delete("/papers/:id", {
//     // schema: semesterSchm.delSemesterSchm,
//     handler: paperCtrl.delete,
//   });

//   app.put("/papers/:id/upload", {
//     preHandler: upload.single("file"),
//     handler: paperCtrl.addFileToPaper,
//   });

//   app.post("/papers/files/:filename", {
//     handler: paperCtrl.getFileFromPaper,
//   });

//   app.delete("/papers/:paperId/del-file", {
//     handler: paperCtrl.deleteFileFromPaper,
//   });
// };

module.exports = paperRoutes;
