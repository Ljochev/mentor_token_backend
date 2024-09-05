const { Validator } = require("node-input-validator");


const newUserValidate = {
    name: "required|string",
    email: "required|email",
    password: "required|string",
    confirmPassword: "required|string",
    type: "required|string",
    phone: "required|string",
    image: "required|string",
    role: "string",
    skills: "array",
    "skills.*": "string",
    desc: "string",
    acceptedJobs: "array",
    "acceptedJobs.*": "string",
    representative: "string",
    address: "string",
    jobsPosted: "array",
    "jobsPosted.*": "string"

};

const updateUserValidate = {
    name: "string",
    email: "email",
    password: "string",
    confirmPassword: "string",
    type: "string",
    phone: "string",
    image: "string",
    role: "string",
    skills: "array",
    "skills.*": "string",
    desc: "string",
    acceptedJobs: "array",
    "acceptedJobs.*": "string",
    representative: "string",
    address: "string",
    jobsPosted: "array",
    "jobsPosted.*": "string"
};

const updatePasswordValidate = {
    newPassword: "required|string",
    confirmNewPassword: "required|string"

};

const validateUser = async (data, schema) => {
    let v = new Validator(data, schema);
    let e = await v.check();
    if (!e) {
        throw v.errors;
    }
};

module.exports = {
    newUserValidate,
    updateUserValidate,
    updatePasswordValidate,
    validateUser,
};