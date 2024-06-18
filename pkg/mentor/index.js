const mongoose = require("mongoose");


const jobAplicationSchema = new mongoose.Schema(
    {
        job_offer_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "JobOffer",
            required: true,
        },
        mentor_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["applied","accepted","rejected"],
            required: true,
            default: "applied",
        },
    },
    { timestamps: true }
)

const JobAplication = mongoose.model("JobAplication", jobAplicationSchema, "job_aplications");




const createAplication = async (job) => {
    const jobAplication = new JobAplication(job);
    return await jobAplication.save();
  };

  const listAplication = async (job = {}) => {
    // console.log("This is from listAplication ", job);
    return await JobAplication.find(job);
  };

  const deleteAplication = async (id) => {
    return await JobAplication.deleteOne(id);
  };

  const updateAplication = async (id, job) => {
    return await JobAplication.updateOne(id, job);
  };


module.exports = {
    createAplication,
    listAplication,
    deleteAplication,
    updateAplication,
};