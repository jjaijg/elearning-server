const semesterSchm = require("../response-schema/semester.schema");
const semesterCtrl = require("../controllers/semesters.controller");

module.exports = (app) => {
  // Get all semesters with related dept
  app.get("/semesters/with-dept", {
    handler: semesterCtrl.fetchWithDept,
  });

  // Get all semesters of a department
  app.get("/semesters/dept/:department", {
    schema: semesterSchm.getDepartmentsSchm,
    handler: semesterCtrl.fetch,
  });

  // Get semester by id
  app.get("/semesters/:id", {
    schema: semesterSchm.getSemesterSchm,
    handler: semesterCtrl.get,
  });

  //   create a department
  app.post("/semesters", {
    schema: semesterSchm.postSemesterSchm,
    handler: semesterCtrl.create,
  });

  //   update a department
  app.put("/semesters/:id", {
    schema: semesterSchm.updSemesterSchm,
    handler: semesterCtrl.update,
  });

  //   delete a department
  app.delete("/semesters/:id", {
    schema: semesterSchm.delSemesterSchm,
    handler: semesterCtrl.delete,
  });
};

// function departmentRoutes(fastify, options, done) {
//   done();
// }

// module.exports = departmentRoutes;
