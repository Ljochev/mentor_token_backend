const mongoose = require("mongoose");


const jobOfferSchema = new mongoose.Schema(
    {
        job_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Job",
            required: true,
        },
        mentor_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
            default: null,
        },
        company_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            required: true,
        },
        type: {
            type: String,
            enum: ["direct", "open"],
            required: true,
            default: "direct",
        },
    },
    { timestamps: true }
)

const JobOffer = mongoose.model("JobOffer", jobOfferSchema, "job_offers");




const createJobOffer = async (job) => {
    const jobOffer = new JobOffer(job);
    return await jobOffer.save();
  };

  const listJobOffer = async (job = {}) => {
    return await JobOffer.find(job);
  };

  const deleteJobOffer = async (id) => {
    return await JobOffer.deleteOne(id);
  };

  const updateJobOffer = async (id, job) => {
    return await JobOffer.updateOne(id, job);
  };


module.exports = {
    createJobOffer,
    listJobOffer,
    deleteJobOffer,
    updateJobOffer,
};