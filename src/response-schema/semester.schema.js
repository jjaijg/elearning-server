const Semester = require("./response-model/semester.model");

// Get semesters options
const getSemestersSchm = {
  response: {
    200: {
      type: "array",
      items: Semester,
    },
  },
};

// Get semester options
const getSemesterSchm = {
  response: {
    200: Semester,
  },
};

// Post semester options
const postSemesterSchm = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string" },
    },
  },
  response: {
    201: Semester,
  },
};

// Update semester options
const updSemesterSchm = {
  response: {
    200: Semester,
  },
};

// delete semester options
const delSemesterSchm = {
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

module.exports = {
  getSemesterSchm,
  getSemestersSchm,
  postSemesterSchm,
  updSemesterSchm,
  delSemesterSchm,
};
