const mongoose = require("mongoose");


const applicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Job",
            required: true,
        },
        mentorId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
            default: null,
        },
        companyId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
            applicationType: {
                type: String,
                enum: ["mentorToCompany", "companyToMentor"],
                required: true,
        },
        status: {
            type: String,
            enum: ["pending", "rejected", "assigned"], //accepted
            required: true,
            default: "pending",
        },
        acceptedStatus: {
            type: String,
            enum: ["done", "rejected", "in progress", "pending"],
            required: true,
            default: "pending",
        },
    },
    { timestamps: true }
)

const Application = mongoose.model("Application", applicationSchema, "application");


// mentor
const createMentorApplication = async (job) => {
    const application = new Application(job);
    return await application.save();
  };
  const listMentorApplication = async (mentorId, acceptedStatus = null) => {
    if (acceptedStatus) {
      return await Application.find({ mentorId, acceptedStatus });
    } else {
      return await Application.find({ mentorId });
    }
  };
  const findApplication = async (_id) => {
      return await Application.findOne({ _id });
  };

  const findMentorAplicationByJobId = async (mentorId, jobId) => {
    return await Application.findOne({ mentorId, jobId });
};

const findPendingAplicationsJobId = async (jobId) => {
  return await Application.find({jobId , acceptedStatus: 'pending'});
};

  const deleteMentorApplication = async (id) => {
    return await Application.deleteOne(id);
  };

  const updateMentorApplication = async (_id, job) => {
    return await Application.updateOne({_id}, job);
  };

 // company

  const createCompanyApplication = async (aplication) => {
    const application = new Application(aplication);
    return await application.save();
  };

  const listCompanyApplication = async (companyId, acceptedStatus) => {
    console.log("This is what i got: ",{companyId, acceptedStatus} )
    if (acceptedStatus) {
      return await Application.find({ companyId, acceptedStatus });
    } else {
      return await Application.find({ companyId });
    }
  };
  
  const listCompanyMentorAp = async (companyId, mentorId, acceptedStatus = false) => {
    if (acceptedStatus && mentorId !== 'null') {
      return await Application.find({ companyId,mentorId, acceptedStatus });
    } else {
      return await Application.find({ companyId, mentorId });
    }
  };

  const deleteCompanyApplication = async (_id) => {
    return await Application.deleteOne({_id});
  };

  const updateCompanyApplication = async (_id, aplication) => {
    return await Application.updateOne({_id}, aplication);
  };

  const listApplication = async (aplication) => {
    return await Application.findOne(aplication);
  };

  const findDateApp = async (mentorId, date) => {
    if(date !== 'null') {
      return await Application.find({
        mentorId, updatedAt: { $gte: date }
      });
    } else {
      return await Application.find({mentorId });
    }
  };

  const findCompanyDateApp = async (companyId, date) => {
  
      return await Application.find({companyId, updatedAt: { $gte: date } });
  };

  const findCompanyDirect = async (companyId, mentorId) => {
    return await Application.find({companyId, mentorId,  applicationType: 'companyToMentor'});
  }


module.exports = {
    createMentorApplication,
    listMentorApplication,
    deleteMentorApplication,
    updateMentorApplication,
    findPendingAplicationsJobId,
    createCompanyApplication,
      listCompanyApplication,
      listCompanyMentorAp,
      deleteCompanyApplication,
      updateCompanyApplication,
      listApplication,
      findApplication,
      findMentorAplicationByJobId,
      findDateApp,
      findCompanyDateApp,
      findCompanyDirect,
};