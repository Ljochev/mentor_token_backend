const {
  createMentorApplication,
    listMentorApplication,
    deleteMentorApplication,
    updateMentorApplication,
    findApplication,
    findMentorAplicationByJobId,
    findDateApp,
} = require("../pkg/application/index.js");

const {
  jobCreate,
  jobListIds,
  jobList,
  allJobsList,
  jobDelete,
  jobEdit,
  oneJob,
} = require("../pkg/jobs/index.js");

const createMentorJobAplication = async (req, res) => {
  try {
    const aplicationExist = await  findMentorAplicationByJobId(req.auth.id, req.params.jobId);
    if(aplicationExist) {
      return res.status(201).send({message: "Aplication already created for this job"});
    } else {
      const job = await oneJob(req.params.jobId);
      console.log(job);
      const jobAplication = await createMentorApplication({
        jobId: job._id, 
        mentorId: req.auth.id, 
        companyId: job.companyId, 
        status: "pending",
        applicationType: "mentorToCompany",
        acceptedStatus: "pending"
      });
      // const aplication = await findApplication(req.auth.id);
      // console.log("Checking mentor_ids: ", allJobs[0].mentor_ids);
      // !allJobs[0].mentor_ids[0] ? console.log("null") :  console.log("somenthing", allJobs[0].mentor_ids[0])
      return res.status(201).send({message: "Aplication was created"});

    }
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
    };
  
  const listMentorJobAplication = async (req, res) => {
    console.log("listMentorJobAplication : ", req.params, "<<params", req.query, "<<query");
    const filter = req.params.acceptedStatus === 'all' ? null : req.params.acceptedStatus;
    // console.log("mentorId: ",req.auth.id , "acceptetStatus: ", filter )
    try {
      let allJobs = []
        if(req.params.mentorId === 'null') { 
           allJobs = await listMentorApplication(req.auth.id, filter) 
        } else if(req.params.mentorId !== 'null'){
           allJobs = await listMentorApplication(req.params.mentorId, filter)
        }
          return res.status(201).send(allJobs);
        } catch (err) {
          console.log(err);
          return res.status(err.status).send(err.error);
        }
  };

  const findOneAplication = async (req, res) => {
    try {
          const oneAplication = await findApplication(req.params._id);
          return res.status(201).send(oneAplication);
        } catch (err) {
          console.log(err);
          return res.status(err.status).send(err.error);
        }
  };

  const findAplicationByMentorJob = async (req, res) => {
    try {
          const oneAplication = await findMentorAplicationByJobId(req.auth.id,req.params.jobId);
          if(oneAplication) {
          return res.status(201).send(true);
          } else {
          return res.status(201).send(false);
          }
        } catch (err) {
          console.log(err);
          return res.status(err.status).send(err.error);
        }
  };
  
  const deleteMentorJobAplication = async (req, res) => {
    try {
        await deleteMentorApplication(req.query);
          return res.status(201).send(`The aplicatin with id: ${req.query} was deleted!`);
        } catch (err) {
          console.log(err);
          return res.status(err.status).send(err.error);
        }
  };
  
  const editMentorJobAplication = async (req, res) => {

    try {
      // await validate ({
      //     mentor_id: "required|string"
      // }, req.body);
      console.log(req.params._id, "==> from editMentorJobAplication", req.body, " ==> and this is the body");
        // get the job aplication 
        let aplication = await findApplication(req.params._id);
        // update the aplication with req.body -> accepted, rejected
         await updateMentorApplication(req.params._id, req.body);
         aplication = await findApplication(req.params._id);
          return res.status(201).send(aplication);
        } catch (err) {
          console.log(err);
          return res.status(err.status).send(err.error);
        }
  };

  const findApppFromDate = async (req, res) => {

    try {
        // get the job aplication 
        let aplications = [];
        req.params.mentorId === "null" ?
         aplications = await findDateApp(req.auth.id, req.params.date) :
         aplications = await findDateApp(req.params.mentorId, req.params.date)
          return res.status(201).send(aplications);
        } catch (err) {
          console.log(err);
          return res.status(err.status).send(err.error);
        }
  };


  module.exports = {
      createMentorJobAplication,
      listMentorJobAplication,
      deleteMentorJobAplication,
      editMentorJobAplication,
      findOneAplication,
      findApppFromDate,
      findAplicationByMentorJob,
};