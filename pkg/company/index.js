const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description : {
            type: String,
            required: true,
        },
        company_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
        mentor_ids: {
            type: [mongoose.SchemaTypes.ObjectId],
            ref: "User",
            default: null,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            required: true,
            default: "pending",
        },
    },
    { timestamps: true }
  );

  const Job = mongoose.model("Job", jobSchema, "jobs");



const jobCreate = async (job) => {
    const newJob = new Job(job);
    return await newJob.save();
};

const jobList = async (job = {}) => {
    return await Job.find(job);
  };

  const jobDelete = async (id) => {
    return await Job.deleteOne(id);
  };

  const jobEdit = async (id, job) => {
    return await Job.updateOne(id, job);
  };




module.exports = {
    jobCreate,
    jobList,
    jobDelete,
    jobEdit,
};