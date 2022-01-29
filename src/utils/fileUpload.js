const multer = require("fastify-multer");
const cloudinary = require("../config/cloudinary.config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    //req.body is empty...
    //How could I get the new_file_name property sent from client here?
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
});

module.exports = {
  upload,
  uploadFile: (content) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "elearning",
            resource_type: "pptx",
          },
          (error, result) => {
            if (error) {
              throw error;
            } else {
              resolve(result);
            }
          }
        )
        .end(content);
    });
  },
};
