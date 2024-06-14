require('dotenv').config();

const express = require("express");
cors = require('cors');
const { expressjwt: jwt } = require("express-jwt");
const {
    register,
} = require("./handlers/authUser.js");

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
        ],
    })
);

app.post("/api/user/register", register);


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
});