const {
    createCompanyApplication,
      listCompanyApplication,
      listCompanyMentorAp,
      deleteCompanyApplication,
      updateCompanyApplication,
      findCompanyDateApp,
      findCompanyDirect,
      findPendingAplicationsJobId,
  } = require("../pkg/application/index.js");


  
  const createCompanyJobAplication = async (req, res) => {
    try {
          const aplication = await createCompanyApplication({
            jobId: req.params.jobId, 
            mentorId: req.params.mentorId,
            companyId: req.auth.id,
            applicationType: "companyToMentor",
            status: "pending",
            acceptedStatus: "pending"
          });
          return res.status(201).send(aplication);
        } catch (err) {
          console.log(err);
          return res.status(err.status).send(err.error);
        }
      };
    
    const listCompanyJobAplication = async (req, res) => {
      const filter = req.params.acceptedStatus === 'all' ? null : req.params.acceptedStatus;
      try {
            const allJobs = await listCompanyApplication(req.auth.id, filter);
            return res.status(201).send(allJobs);
          } catch (err) {
            console.log(err);
            return res.status(err.status).send(err.error);
          }
    };

    const listMentorCompanyAp = async (req, res) => {
      const filter = req.params.acceptedStatus === 'all' ? null : req.params.acceptedStatus;
      try {
            const allAplications = await listCompanyMentorAp(req.auth.id,req.params.mentorId, filter);
            return res.status(201).send(allAplications);
          } catch (err) {
            console.log(err);
            return res.status(err.status).send(err.error);
          }
    };
    
    const deleteCompanyJobAplication = async (req, res) => {
      try {
          await deleteCompanyApplication(req.params._id);
            return res.status(201).send({message: `The aplicatin with id: ${req.params._id} was deleted!`});
          } catch (err) {
            console.log(err);
            return res.status(err.status).send(err.error);
          }
    };
    
    const editCompanyJobAplication = async (req, res) => {
      try {
          const edited = await updateCompanyApplication(req.params._id, req.body);
            return res.status(201).send(edited);
          } catch (err) {
            console.log(err);
            return res.status(err.status).send(err.error);
          }
    };

 const findCompanyApppFromDate = async (req, res) => {
   try {
           const aplications = await findCompanyDateApp(req.auth.id, req.params.date);
            return res.status(201).send(aplications);
      } catch (err) {
        console.log(err);
        return res.status(err.status).send(err.error);
      }
};
  
  const findCompanyToMentor = async (req, res) => {
    try {
       const aplications = await findCompanyDirect(req.auth.id, req.params.mentorId);
        return res.status(201).send(aplications);
  } catch (err) {
    console.log(err);
    return res.status(err.status).send(err.error);
  }
  };
  const listPendingAplicationsByJob = async (req, res) => {
    try {
            const aplications = await findPendingAplicationsJobId(req.params.jobId);
             return res.status(201).send(aplications);
       } catch (err) {
         console.log(err);
         return res.status(err.status).send(err.error);
       }
 };
  

    module.exports = {
        createCompanyJobAplication,
        listCompanyJobAplication,
        listMentorCompanyAp,
        deleteCompanyJobAplication,
        editCompanyJobAplication,
        findCompanyApppFromDate,
        findCompanyToMentor,
        listPendingAplicationsByJob,
  };