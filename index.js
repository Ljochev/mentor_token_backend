require('dotenv').config();

const express = require("express");
const cors = require('cors');
const { expressjwt: jwt } = require("express-jwt");

const {
    register,
    login,
    checkEmail,
    getUser,
    updateUser,
    getAllCompanies,
    getAllMentors,
    getUserMentorName,
    getUserCompanyName,
    getCompanyById,
    getMentorById,
} = require("./handlers/authUser.js");

const {
    listJobsByCompany,
    listJobsByIds,
    editJob,
    findJob,
    listAllOpenJobs,
    listCompanyOpen,
} = require("./handlers/jobsHandlers.js");

const {
    createJob,
    deleteJob,
} = require("./handlers/companyJobHandlers.js");

const {
    createMentorJobAplication,
    listMentorJobAplication,
    deleteMentorJobAplication,
    editMentorJobAplication,
    findOneAplication,
    findApppFromDate,
    findAplicationByMentorJob,
} = require("./handlers/mentorAppHandlers.js");

const {
    createCompanyJobAplication,
    listCompanyJobAplication,
    listMentorCompanyAp,
    deleteCompanyJobAplication,
    editCompanyJobAplication,
    findCompanyApppFromDate,
    findCompanyToMentor,
    listPendingAplicationsByJob,
} = require("./handlers/companyAppHandlers.js");

// connecting with database
require("./pkg/db/index");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    jwt({
        secret: process.env.jwt_secret,
        algorithms: ["HS256"],
    }).unless({
        path: [
            // routes that do not require authentication
            "/api/user/register",
            "/api/user/login",
            "/api/user/checkEmail"
        ],
    })
);


// registration, authentication, and authorization routes
app.post("/api/user/register", register);
app.post("/api/user/checkEmail", checkEmail);
app.post("/api/user/login", login);
app.get("/api/user", getUser);
app.get("/api/user/mentor/:name", getUserCompanyName);
app.get("/api/user/company/:name", getUserMentorName);
app.get("/api/user/companies", getAllCompanies);
app.get("/api/user/companyId/:_id", getCompanyById);
app.get("/api/user/mentorId/:_id", getMentorById);
app.get("/api/user/mentors", getAllMentors);
app.put("/api/user", updateUser);

// job routes
app.post("/api/job", createJob);
app.get("/api/job/allCompanies", listAllOpenJobs);
app.get("/api/job/company/open", listCompanyOpen);
app.get("/api/job/ids/:ids", listJobsByIds);
app.get("/api/job/one/:_id", findJob);
app.get("/api/job/all/:companyId", listJobsByCompany);
app.delete("/api/job/:_id", deleteJob);
app.put("/api/job/:jobId", editJob);

// mentor routes
app.post("/api/mentor/application/:jobId", createMentorJobAplication);
app.get("/api/mentor/application/:mentorId/:acceptedStatus", listMentorJobAplication);
app.get("/api/mentor/oneApplication/:_id", findOneAplication);
app.get("/api/mentor/dateApplications/:mentorId/:date", findApppFromDate);
app.get("/api/mentor/jobApplication/:jobId", findAplicationByMentorJob);
app.delete("/api/mentor/application", deleteMentorJobAplication);
app.put("/api/mentor/application/:_id", editMentorJobAplication);

// company routes
app.post("/api/company/application/:jobId/:mentorId", createCompanyJobAplication);
app.get("/api/company/application/:acceptedStatus", listCompanyJobAplication);
app.get("/api/company/job/pendingApps/:jobId", listPendingAplicationsByJob);
app.get("/api/company/mentorApplications/:mentorId/:acceptedStatus", listMentorCompanyAp);
app.get("/api/company/dateApplications/:date", findCompanyApppFromDate);
app.get("/api/directAplications/:mentorId", findCompanyToMentor);
app.delete("/api/company/application/:_id", deleteCompanyJobAplication);
app.put("/api/company/application/:_id", editCompanyJobAplication);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});