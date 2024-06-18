const {
    jobCreate,
    jobList,
    jobDelete,
    jobEdit,
} = require("../pkg/company/index.js");

const {
  createJobOffer,
    listJobOffer,
    deleteJobOffer,
    updateJobOffer,
} = require("../pkg/jobOffers/index.js");



const createJob = async (req, res) => {
  console.log("I'm in createJob",req.auth);
try {
  if(req.auth.role !== "company")
    return res.status(400).send("Acces allowed only for companies!");
  console.log({...req.body, ...{company_id: req.auth.id}});
      await jobCreate({...req.body, ...{company_id: req.auth.id}});
      const allJobs = await jobList();
      // console.log("Checking mentor_ids: ", allJobs[0].mentor_ids);
      // !allJobs[0].mentor_ids[0] ? console.log("null") :  console.log("somenthing", allJobs[0].mentor_ids[0])
      return res.status(201).send(allJobs);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send(err.error);
    }
  };

const listJobs = async (req, res) => {
  console.log(req.params, "This are the params");
  try {
      console.log(req.params," this is params, and this : ", req.query, " is query!");
        const allJobs = await jobList(req.query);
        // console.log("All company jobs : ", allJobs);
        return res.status(201).send(allJobs);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};

const deleteJob = async (req, res) => {
  try {
      await jobDelete(req.query);
        return res.status(201).send(`The job with id: ${req.query} was deleted!`);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};

const editJob = async (req, res) => {
  console.log("EDITtttt");
  try {
      await jobEdit(req.query, req.body);
        return res.status(201).send(`The job with id: ${req.query} was edited!`);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};

const sendJobOffer = async (req, res) => {
  console.log("sendddd");
  try {
    if(req.auth.role !== "company")
      return res.status(400).send("Acces allowed only for companies!");
      await createJobOffer(req.body);
        return res.status(201).send(`Job was created!`);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};

const getJobOffer = async (req, res) => {
  try {
    const getJobs = await listJobOffer(req.query);
    return res.status(201).send(getJobs);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};

const earseJobOffer = async (req, res) => {
  try {
      await deleteJobOffer(req.query);
        return res.status(201).send(`The job with id: ${req.query} was deleted!`);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};

const editJobOffer = async (req, res) => {
  try {
      await updateJobOffer(req.query, req.body);
        return res.status(201).send(`The job with id: ${req.query} was edited!`);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};

  module.exports = {
    createJob,
    listJobs,
    deleteJob,
    editJob,
    sendJobOffer,
    getJobOffer,
    earseJobOffer,
    editJobOffer,
  };