const {
  jobCreate,
    jobListIds,
    jobListByCompany,
    allOpenJobsList,
    jobDelete,
    jobEdit,
    oneJob,
} = require("../pkg/jobs/index.js");



const listJobsByIds = async (req, res) => {
  try {
        const allJobs = await jobListIds(req.params.ids);
        return res.status(201).send(allJobs);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};

const listJobsByCompany = async (req, res) => {
  try {
        const allJobs = await jobListByCompany(req.params.companyId, 'open');
        return res.status(201).send(allJobs);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};

const listCompanyOpen = async (req, res) => {
  try {
    const allJobs = await jobListByCompany(req.auth.id, 'open');
    return res.status(201).send(allJobs);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};

const listAllOpenJobs = async (req, res) => {
  try {
        const allJobs = await allOpenJobsList();
        // console.log("All company jobs : ", allJobs);
        return res.status(201).send(allJobs);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};



const findJob = async (req, res) => {
  console.log(req.params._id, "This are the params");
  try {
      // console.log(req.params," this is params, and this : ", req.query, " is query!");
        const job = await oneJob(req.params._id);
        // console.log("All company jobs : ", allJobs);
        return res.status(201).send(job);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};


const editJob = async (req, res) => {
  console.log("EDITtttt");
  try {
      const jobEdited = await jobEdit(req.params.jobId, req.body);
        return res.status(201).send(jobEdited);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};



  module.exports = {
    listJobsByIds,
    listJobsByCompany,
    editJob,
    findJob,
    listAllOpenJobs,
    listCompanyOpen,
  };