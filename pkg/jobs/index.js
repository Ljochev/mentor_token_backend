const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const jobSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description : {
            type: String,
            required: true,
        },
        skillsRequired: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["direct", "open"],
            required: true,
            default: "open",
        },
        category : {
          type: String,
          enum: ["software", "sciense", "finanse","marketing","other"],
          required: true,
          default: "other",
      },
    },
    { timestamps: true }
  );

  const Job = mongoose.model("Job", jobSchema, "jobs");



const jobCreate = async (job) => {
    const newJob = new Job(job);
    return await newJob.save();
};

const jobListIds = async (ids) => {
    const idArray = ids.split(',').map(id => id.trim().toString());
    return await Job.find({_id: { $in: idArray }});
  };
const jobListByCompany = async ( companyId, status = 'open') => {
  return await Job.find({companyId, status});
}
const allOpenJobsList = async (status = 'open') => {
  return await Job.find({status});
}
const oneJob = async (_id) => {
    return await Job.findOne({_id});
  };
  const jobDelete = async (_id) => {
    return await Job.deleteOne({_id});
  };

  const jobEdit = async (_id, job) => {
    return await Job.updateOne({_id}, job);
  };




module.exports = {
    jobCreate,
    jobListIds,
    jobListByCompany,
    allOpenJobsList,
    jobDelete,
    jobEdit,
    oneJob,
};