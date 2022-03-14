const fs = require("fs");
const { promisify } = require("util");
const filesize = require("filesize");
const Paper = require("../model/paper.model.db");
const Semester = require("../model/semester.model.db");

const delFile = promisify(fs.unlink);

module.exports = {
  fetch: async (req, reply) => {
    const { semester } = req.params;
    const papers = await Paper.find({ semester }).populate(["semester"]);
    reply.send(papers);
  },

  fetchAll: async (req, reply) => {
    const papers = await Paper.find({}).populate({
      path: "semester",
      select: ["_id", "name", "department"],
      populate: {
        path: "department",
        model: "departments",
        select: ["_id", "name"],
      },
    });
    reply.send(papers);
  },

  get: async (req, reply) => {
    const { id } = req.params;
    const paper = await Paper.findById(id).populate([
      "semester",
      // "papers"
    ]);
    reply.send(paper);
  },

  create: async (req, reply) => {
    // const collection = fastify.mongo.db.collection("departments");

    const { name, semester } = req.body;
    try {
      const paper = {
        name,
        semester,
      };
      // console.log(name, semester);
      const isPaperExist = await Paper.find({ name, semester });
      if (isPaperExist?.length) {
        return reply.code(400).send({
          message: `${name} already present in the selected semester`,
        });
      }
      const newPaper = await Paper.create(paper);
      const semById = await Semester.findById(semester);
      semById.papers.push(newPaper);
      await semById.save();
      reply.code(201).send(newPaper);
    } catch (error) {
      return reply.code(500).send({
        message: `Error while adding ${name}`,
      });
    }
  },

  update: async (req, reply) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const isPaperExist = await Paper.find({ name });
      if (isPaperExist.length) {
        return reply.code(400).send({ message: `${name} already exists` });
      }
      await Paper.findByIdAndUpdate(id, req.body);
      const papToUpdate = await Paper.findById(id).populate(["semester"]);
      reply.send(papToUpdate);
    } catch (error) {
      reply.code(500).send({ message: "Error while updating the paper!" });
    }
  },

  delete: async (req, reply) => {
    const { id } = req.params;
    try {
      const papToDelete = await Paper.findById(id);
      const semId = papToDelete.semester;
      const files = papToDelete.files;

      await Paper.findByIdAndDelete(id);

      const sem = await Semester.findById(semId);
      sem.papers.pull({ _id: id });
      await sem.save();

      files.forEach(async (file) => {
        try {
          await delFile(file.fileDest);
        } catch (error) {
          // console.log("Error in deleting file : ", file.fileDest);
          console.log(error);
          return reply.code(500).send({
            message: `Error while deleting file : ${file.fileDest}`,
          });
        }
      });

      reply
        .code(200)
        .send({ data: papToDelete, message: "Paper deleted successfully" });
    } catch (error) {
      reply.code(500).send({
        message: `Error while deleting paper!`,
      });
    }
  },

  addFileToPaper: async (req, reply) => {
    try {
      if (!req.file) {
        return reply.code(400).send({ message: "Please upload a file!" });
      }

      const { id } = req.params;

      try {
        // Make the file public

        const paper = await Paper.findById(id);
        paper.files.push({
          fileName: req.file.filename,
          fileUrl:
            process.env.SERVER_URL + "/papers/files/" + req.file.filename,
          fileDest: req.file.path,
          fileType: req.file.filename.split(".").pop(),
          fileSize: filesize(req.file.size),
          fileMime: req.file.mimetype,
        });

        await paper.save();
      } catch (err) {
        console.log(err);
        return reply.code(500).send({
          message: `Error while adding file details to the paper!`,
          url: req.file.filename,
        });
      }
      reply.code(200).send({
        message: "Uploaded the file successfully: " + req.file.filename,
        url: req.file.filename,
      });
    } catch (error) {
      console.log(error);
      reply.code(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
    }
  },

  getFileFromPaper: (req, reply) => {
    try {
      const { path } = req.body;

      fs.readFile(path, (err, fileBuffer) => {
        reply.send(err || fileBuffer);
      });
    } catch (error) {
      reply.code(500).send({
        message: "Error in downloading the file!",
      });
    }
  },

  deleteFileFromPaper: async (req, reply) => {
    try {
      const { paperId } = req.params;
      const { fileName, fileDest } = req.query;

      // const paper = await Paper.findById(paperId);
      try {
        await delFile(fileDest);
      } catch (error) {
        console.log(error);
        return reply.code(500).send({
          message: `Error while deleting file : ${fileDest}`,
        });
      }

      // paper.files.pull({ files: { fileName } });
      await Paper.updateOne(
        { _id: paperId },
        { $pull: { files: { fileName } } }
      );
      reply.code(200).send({ message: "File deleted successfully!" });
    } catch (error) {
      console.log(error);
      reply.code(500).send({
        message: "Error in deleting the file!",
      });
    }
  },
};
