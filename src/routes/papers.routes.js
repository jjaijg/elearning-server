// const semesterSchm = require("../response-schema/semester.schema");
const paperCtrl = require("../controllers/papers.controller");
const { upload } = require("../utils/fileUpload");

module.exports = (app) => {
  // Get all papers
  app.get("/papers/all", {
    // schema: semesterSchm.getDepartmentsSchm,
    handler: paperCtrl.fetchAll,
  });

  // Get all papers of a semester
  app.get("/papers/sem/:semester", {
    // schema: semesterSchm.getDepartmentsSchm,
    handler: paperCtrl.fetch,
  });

  // Get paper by id
  app.get("/papers/:id", {
    // schema: semesterSchm.getSemesterSchm,
    handler: paperCtrl.get,
  });

  //   create a paper
  app.post("/papers", {
    // schema: semesterSchm.postSemesterSchm,
    handler: paperCtrl.create,
  });

  //   update a paper
  app.put("/papers/:id", {
    // schema: semesterSchm.updSemesterSchm,
    handler: paperCtrl.update,
  });

  //   delete a paper
  app.delete("/papers/:id", {
    // schema: semesterSchm.delSemesterSchm,
    handler: paperCtrl.delete,
  });

  app.put("/papers/:id/upload", {
    preHandler: upload.single("file"),
    handler: paperCtrl.addFileToPaper,
  });

  app.post("/papers/files/:filename", {
    handler: paperCtrl.getFileFromPaper,
  });

  app.delete("/papers/:paperId/del-file", {
    handler: paperCtrl.deleteFileFromPaper,
  });
};
