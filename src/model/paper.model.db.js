const mongoose = require("mongoose");
const { Schema } = mongoose;

const paperSchema = new Schema({
  name: { type: String, required: true },
  files: [
    {
      fileName: { type: String },
      fileUrl: { type: String },
      fileDest: { type: String },
      fileType: { type: String },
      fileSize: { type: String },
      fileMime: { type: String },
    },
  ],
  semester: { type: Schema.Types.ObjectId, ref: "semesters", required: true },
});

const Paper = mongoose.model("papers", paperSchema);

module.exports = Paper;
