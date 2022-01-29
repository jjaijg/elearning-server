const departmentSchm = require("../response-schema/department.schema");
const departmentCtrl = require("../controllers/departments.controller");

module.exports = (app) => {
  // Get all departments
  app.get("/departments", {
    schema: departmentSchm.getDepartmentsSchm,
    handler: departmentCtrl.fetch,
  });

  // Get department by id
  app.get("/departments/:id", {
    schema: departmentSchm.getDepartmentSchm,
    handler: departmentCtrl.get,
  });

  //   create a department
  app.post("/departments", {
    schema: departmentSchm.postDepartmentSchm,
    handler: departmentCtrl.create,
  });

  //   update a department
  app.put("/departments/:id", {
    schema: departmentSchm.updDepartmentSchm,
    handler: departmentCtrl.update,
  });

  //   delete a department
  app.delete("/departments/:id", {
    schema: departmentSchm.delDepartmentSchm,
    handler: departmentCtrl.delete,
  });
};

// function departmentRoutes(fastify, options, done) {
//   done();
// }

// module.exports = departmentRoutes;
