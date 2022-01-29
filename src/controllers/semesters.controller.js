const fs = require("fs");
const { promisify } = require("util");
const Department = require("../model/department.model.db");
const Semester = require("../model/semester.model.db");
const Paper = require("../model/paper.model.db");

const delFile = promisify(fs.unlink);

module.exports = {
  fetch: async (req, reply) => {
    const { department } = req.params;
    const semesters = await Semester.find({ department }).populate([
      // "department",
      "papers",
    ]);
    reply.send(semesters);
  },
  fetchWithDept: async (req, reply) => {
    const semesters = await Semester.find({}).populate([
      "department",
      "papers",
    ]);
    reply.send(semesters);
  },

  get: async (req, reply) => {
    const { id } = req.params;
    const sem = await Semester.findById(id).populate([
      "department",
      // "papers"
    ]);
    reply.send(sem);
  },

  create: async (req, reply) => {
    // const collection = fastify.mongo.db.collection("departments");

    const { name, department } = req.body;
    const sem = {
      name,
      department,
    };
    const isSemExist = await Semester.find({ name, department });
    if (isSemExist.length) {
      return reply.code(400).send({ message: "Semester already exists" });
    }
    const newSem = await Semester.create(sem);
    const deptById = await Department.findById(department);
    deptById.semesters.push(newSem);
    await deptById.save();
    reply.code(201).send(newSem);
  },

  update: async (req, reply) => {
    const { id } = req.params;
    const { name, department } = req.body;
    try {
      const isSemExist = await Semester.find({ name, department });
      console.log("sem exist : ", isSemExist);
      if (isSemExist?.length) {
        return reply
          .code(400)
          .send({
            message: `${name} already present in the selected department!`,
          });
      }
      await Semester.findByIdAndUpdate(id, req.body);
      const semToUpdate = await Semester.findById(id).populate([
        "department",
        "papers",
      ]);
      reply.code(200).send(semToUpdate);
    } catch (error) {
      reply.code(500).send({ message: "Error while updating semester!" });
    }
  },

  delete: async (req, reply) => {
    const { id } = req.params;
    try {
      const semToDelete = await Semester.findById(id);
      const papersToDel = semToDelete.papers;
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
      const deptId = semToDelete.department;
      const dept = await Department.findById(deptId);
      dept.semesters.pull({ _id: id });
      await dept.save();
      await Semester.findByIdAndDelete(id);

      reply
        .code(200)
        .send({ data: semToDelete, message: "Semester deleted successfully" });
    } catch (error) {
      reply.code(500).send({ message: "Error while deleting semester!" });
    }
  },
};
