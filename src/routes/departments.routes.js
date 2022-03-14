const FastifyAuth = require("fastify-auth");

const auth = require("../utils/auth");
const verifyToken = require("../utils/verifyToken");

const departmentSchm = require("../response-schema/department.schema");
const departmentCtrl = require("../controllers/departments.controller");

const departmentRoutes = async (fastify, opts) => {
  fastify
    .decorate("asyncVerifyJWT", verifyToken)
    .decorate("asyncVerifyUsernameAndPassword", auth)
    .register(FastifyAuth)
    .after(() => {
      // Get all departments
      fastify.route({
        method: ["GET"],
        url: "/departments",
        schema: departmentSchm.getDepartmentsSchm,
        handler: departmentCtrl.fetch,
      });

      // Get department by id
      fastify.route({
        method: ["GET"],
        url: "/departments/:id",
        schema: departmentSchm.getDepartmentSchm,
        handler: departmentCtrl.get,
      });

      //   create a department
      fastify.route({
        method: ["POST"],
        url: "/departments",
        schema: departmentSchm.postDepartmentSchm,
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: departmentCtrl.create,
      });

      //   update a department
      fastify.route({
        method: ["PUT"],
        url: "/departments/:id",
        schema: departmentSchm.updDepartmentSchm,
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: departmentCtrl.update,
      });

      //   delete a department
      fastify.route({
        method: ["DELETE"],
        url: "/departments/:id",
        schema: departmentSchm.delDepartmentSchm,
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: departmentCtrl.delete,
      });
    });
};

// module.exports = (app) => {
//   // Get all departments
//   app.get("/departments", {
//     schema: departmentSchm.getDepartmentsSchm,
//     handler: departmentCtrl.fetch,
//   });

//   // Get department by id
//   app.get("/departments/:id", {
//     schema: departmentSchm.getDepartmentSchm,
//     handler: departmentCtrl.get,
//   });

//   //   create a department
//   app.post("/departments", {
//     schema: departmentSchm.postDepartmentSchm,
//     handler: departmentCtrl.create,
//   });

//   //   update a department
//   app.put("/departments/:id", {
//     schema: departmentSchm.updDepartmentSchm,
//     handler: departmentCtrl.update,
//   });

//   //   delete a department
//   app.delete("/departments/:id", {
//     schema: departmentSchm.delDepartmentSchm,
//     handler: departmentCtrl.delete,
//   });
// };

// function departmentRoutes(fastify, options, done) {
//   done();
// }

module.exports = departmentRoutes;
