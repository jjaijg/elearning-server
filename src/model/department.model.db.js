const mongoose = require("mongoose");
const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  semesters: [{ type: Schema.Types.ObjectId, ref: "semesters" }],
});

const Department = mongoose.model("departments", departmentSchema);

module.exports = Department;
