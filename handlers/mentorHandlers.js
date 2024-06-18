const {
    createAplication,
    listAplication,
    deleteAplication,
    updateAplication,
} = require("../pkg/mentor/index.js");

const {
    jobList,
    jobDelete,
    jobEdit,
} = require("../pkg/company/index.js");

const {
    createJobOffer,
    listJobOffer,
    deleteJobOffer,
    updateJobOffer,
} = require("../pkg/jobOffers/index.js")

const createJobAplication = async (req, res) => {
  try {
    if(req.auth.role !== "mentor")
      return res.status(400).send("Acces allowed only for companies!");
        await createAplication({...req.body,...{job_offer_id: req.params.id}, ...{mentor_id: req.auth.id},});
        const allJobAplications = await listAplication();
        // console.log("Checking mentor_ids: ", allJobs[0].mentor_ids);
        // !allJobs[0].mentor_ids[0] ? console.log("null") :  console.log("somenthing", allJobs[0].mentor_ids[0])
        return res.status(201).send(allJobAplications);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
    };
  
  const listJobAplication = async (req, res) => {
    console.log(req.params, "This are the params");
    try {
        console.log(req.params," this is params, and this : ", req.query, " is query!");
          const allJobs = await listAplication(req.query);
          // console.log("All company jobs : ", allJobs);
          return res.status(201).send(allJobs);
        } catch (err) {
          console.log(err);
          return res.status(err.status).send(err.error);
        }
  };
  
  const deleteJobAplication = async (req, res) => {
    try {
        await deleteAplication(req.query);
          return res.status(201).send(`The aplicatin with id: ${req.query} was deleted!`);
        } catch (err) {
          console.log(err);
          return res.status(err.status).send(err.error);
        }
  };
  
  const editJobAplication = async (req, res) => {

    try {
        // await validate ({
        //     mentor_id: "required|string"
        // }, req.body);
        // get the job aplication 
        const aplication = await listAplication(req.query);
        // update the aplication with req.body -> accepted, rejected
         await updateAplication(req.query, req.body);
         //  get the job offer
         const jobOffer = await listJobOffer({_id: aplication[0].job_offer_id});
         // update the job offer with req.body -> accepted, rejected
         await updateJobOffer({_id: jobOffer[0]._id}, req.body);

         if(req.body.status === "accepted" && req.auth.role === "company") {
         // get the job and update it if job is accepted
            const theJob = await jobList({_id: jobOffer[0].job_id});
            let theJobMentors = theJob[0].mentor_ids;
            theJobMentors.push(jobOffer[0].mentor_id);
            const JobMentors = theJobMentors.filter((item, index) => {
            return theJobMentors.indexOf(item) === index;
                });
            // update the mentor field
            await jobEdit({_id: jobOffer[0].job_id},{mentor_ids: JobMentors, status: "in_progress"});
        }
          return res.status(201).send(aplication);
        } catch (err) {
          console.log(err);
          return res.status(err.status).send(err.error);
        }
  };


  module.exports = {
      createJobAplication,
      listJobAplication,
      deleteJobAplication,
      editJobAplication,
};