const { Validator } = require("node-input-validator");

const newJobValidate = {
    title: "required|string",
  description: "required|string",
  category: "required|string",
  skillsRequired: "array",
    "skills.*": "string",
  status: "required|string",
};

const updateJobValidate = {
    title: "string",
  description: "string",
  category: "string",
  skillsRequired: "array",
    "skills.*": "string",
  status: "string",
};

const validateJob = async (data, schema) => {
    let v = new Validator(data, schema);
    let e = await v.check();
    if(!e) {
        throw v.errors;
    }
};

module.exports = {
    newJobValidate,
    updateJobValidate,
    validateJob,
};