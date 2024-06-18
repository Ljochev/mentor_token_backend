require('dotenv').config();

const express = require("express");
cors = require('cors');
const { expressjwt: jwt } = require("express-jwt");
const {
    register,
    login,
} = require("./handlers/authUser.js");

const {
    createJob,
    listJobs,
    deleteJob,
    editJob,
    sendJobOffer,
    getJobOffer,
    earseJobOffer,
    editJobOffer,
} = require("./handlers/companyHandlers.js");

const {
    createJobAplication,
      listJobAplication,
      deleteJobAplication,
      editJobAplication,
} = require("./handlers/mentorHandlers.js");

// conecting with database
require("./pkg/db/index");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    jwt({
        secret: `${process.env.jwt_secret}`,
        algorithms: ["HS256"],
    }).unless({
        path: [
// we add the rouths we dont want to be authenticated
"/api/user/register",
"/api/user/login"
        ],
    })
);
//  registration, authentication, and authorization routes
app.post("/api/user/register", register);
app.post("/api/user/login", login);

// company jobs routes
app.post("/api/company/job", createJob);
app.get("/api/company/job", listJobs);
app.delete("/api/company/job", deleteJob);
app.put("/api/company/job", editJob);

// company jobOffers
app.post("/api/company/jobOffer", sendJobOffer);
app.get("/api/company/jobOffer", getJobOffer);
app.delete("/api/company/jobOffer", earseJobOffer);
app.put("/api/company/jobOffer", editJobOffer);

// mentor routes
app.post("/api/mentor/:id", createJobAplication);
app.get("/api/mentor", listJobAplication);
app.delete("/api/mentor", deleteJobAplication);
app.put("/api/mentor", editJobAplication);



app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
});