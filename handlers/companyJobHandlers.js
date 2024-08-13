const {
    jobCreate,
    allOpenJobsList,
    jobDelete,
    jobEdit,
    oneJob,
} = require("../pkg/jobs/index.js");


const createJob = async (req, res) => {
  try {
    if(req.auth.type !== "company")
      return res.status(400).send("Acces allowed only for companies!");
    console.log({...req.body, ...{companyId: req.auth.id}});
        const newJob = await jobCreate({...req.body, ...{companyId: req.auth.id}});
        
      


        return res.status(201).send(newJob);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
    };

    const deleteJob = async (req, res) => {
        try {
            await jobDelete(req.params._id);
              return res.status(201).send({ message: `The job with id: ${req.params._id} was deleted!`});
            } catch (err) {
              console.log(err);
              return res.status(err.status).send(err.error);
            }
      };

  module.exports = {
      createJob,
    deleteJob,
  };
