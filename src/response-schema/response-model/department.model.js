// Department schema
const Department = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    semesters: {
      type: "array",
    },
  },
};

module.exports = Department;
