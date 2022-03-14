const multer = require("fastify-multer");
const util = require("util");
// const cloudinary = require("../config/cloudinary.config");
const SUPPORT_FILES = process.env.SUPPORTED_TYPES || [
  "image/png",
  "application/pdf",
];
// const MAX_FILE_SIZE = (process.env.ALLOWED_FILE_SIZE_IN_MB || 10) * 1048576;
// console.log(MAX_FILE_SIZE, process.env.SUPPORTED_TYPES);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname.split(".").slice(0, -1).join("") +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: (process.env.ALLOWED_FILE_SIZE_IN_MB || 10) * 1048576,
  },
  fileFilter: (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"]);

    if (!SUPPORT_FILES.includes(file.mimetype)) {
      cb(null, false);
      console.log("error in uplaod");
      return cb(new Error(`${file.mimetype} is not supported!`));
    } else if (
      fileSize >
      (process.env.ALLOWED_FILE_SIZE_IN_MB || 5) * 1048576
    ) {
      cb(null, false);
      return cb(
        new Error(
          `File size is greater than allowed size ${process.env.ALLOWED_FILE_SIZE_IN_MB}mb !`
        )
      );
    } else cb(null, true);
  },
});

module.exports = {
  upload,
  uploadFile: async (req, reply, done) => {
    try {
      const uploadsingleFile = util.promisify(upload.single("file"));
      await uploadsingleFile(req, reply);
    } catch (error) {
      // console.log(error);
      return reply.status(400).send({ message: error.message });
    }
  },
};
