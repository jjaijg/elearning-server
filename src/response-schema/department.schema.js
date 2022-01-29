const Department = require("./response-model/department.model");

// Get departments options
const getDepartmentsSchm = {
  response: {
    200: {
      type: "array",
      items: Department,
    },
  },
};

// Get department options
const getDepartmentSchm = {
  response: {
    200: Department,
  },
};

// Post department options
const postDepartmentSchm = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string" },
    },
  },
  response: {
    201: Department,
  },
};

// Update department options
const updDepartmentSchm = {
  response: {
    200: Department,
  },
};

// delete department options
const delDepartmentSchm = {
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
  getDepartmentSchm,
  getDepartmentsSchm,
  postDepartmentSchm,
  updDepartmentSchm,
  delDepartmentSchm,
};
