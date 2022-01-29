const mongoose = require("mongoose");
const { Schema } = mongoose;

const semesterSchema = new Schema({
  name: { type: String, required: true },
  department: {
    type: Schema.Types.ObjectId,
    ref: "departments",
    required: true,
  },
  papers: [{ type: Schema.Types.ObjectId, ref: "papers" }],
});

const Semester = mongoose.model("semesters", semesterSchema);

module.exports = Semester;
