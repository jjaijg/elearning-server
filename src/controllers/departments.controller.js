const fs = require("fs");
const { promisify } = require("util");
const Department = require("../model/department.model.db");
const Semester = require("../model/semester.model.db");
const Paper = require("../model/paper.model.db");

const delFile = promisify(fs.unlink);

module.exports = {
  fetch: async (req, reply) => {
    const departments = await Department.find({});
    reply.send(departments);
  },

  get: async (req, reply) => {
    const { id } = req.params;
    const dept = await Department.findById(id);
    reply.send(dept);
  },

  create: async (req, reply) => {
    // const collection = fastify.mongo.db.collection("departments");

    const { name } = req.body;
    const dept = {
      name,
    };
    const newDept = await Department.create(dept);
    reply.code(201).send(newDept);
  },
  update: async (req, reply) => {
    const { id } = req.params;
    // const { name } = req.body;
    await Department.findByIdAndUpdate(id, req.body);
    const departmentToUpdate = await Department.findById(id).populate(
      "semesters"
    );
    reply.send(departmentToUpdate);
  },

  delete: async (req, reply) => {
    const { id } = req.params;
    try {
      const depToDelete = await Department.findById(id);
      const semestersToDel = depToDelete.semesters;
      semestersToDel.forEach(async (sem) => {
        const semester = await Semester.findById(sem);
        const papersToDel = semester.papers;
        papersToDel.forEach(async (pap) => {
          const paper = await Paper.findById(pap);
          const files = paper.files;
          files.forEach(async (file) => {
            try {
              await delFile(file.fileDest);
            } catch (error) {
              console.log("Error in deleting file : ", file.fileDest);
              console.log(error);
            }
          });
          try {
            await Paper.findByIdAndDelete(pap);
          } catch (error) {
            console.log("error in deleting paper : ", pap.name);
          }
        });
        try {
          await Semester.findByIdAndDelete(sem);
        } catch (error) {
          console.log("Error in deleting semester : ", semester.name);
        }
      });
      await Department.findByIdAndDelete(id);
      reply.code(200).send({
        data: depToDelete,
        message: "Department deleted successfully",
      });
    } catch (error) {
      reply.code(500).send({
        message: "Error while deleting department!",
      });
    }
  },
};
