const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const {
    createUser,
    getByEmail,
    getById,
    editUser,
    getCompanies,
    getMentors,
    getMentorByName,
    getCompanyByName,
    getCompanyId,
    getMentorId,
} = require("../pkg/user/index");


const register =  async (req, res) => {
  console.log(req.body);
    const {
      name, 
      email, 
      password, 
      confirmPassword, 
      type, 
      phone,
      image, 
      skills = undefined, 
      desc = undefined, 
      acceptedJobs = undefined, 
      representative = undefined, 
      address = undefined, 
      jobsPosted = undefined
    } = req.body;
      try {
        console.log("First step in register");

        const existsEmail = await getByEmail(email);
      // check if there is user registered with this email
      if (existsEmail) {
        return res.status(400).send({ message: "Account with this email already exists!" });
      }
     
      if (password !== confirmPassword) {
        return res
          .status(400)
          .send({ message: "Confirm password is not the same as password!" });
      }
      req.body.password = bcrypt.hashSync(password); // password-ot e sifriran i e nerazbirliv za nas lugjeto
      const acc = await createUser(req.body);
      return res.status(201).send(acc);

      } catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Internal Server Error" });
      };
    };





const registerr = async (req, res) => {
    // se vrakja novo kreiraniot korisnik
    // 
    console.log(req.body);
    const {
      name, 
      email, 
      password, 
      confirmPassword, 
      type, 
      phone, 
      skills = undefined, 
      desc = undefined, 
      acceptedJobs = undefined, 
      representative = undefined, 
      address = undefined, 
      jobsPosted = undefined
    } = req.body;
    try {
      const existsEmail = await getByEmail(email);
      // check if there is user registered with this email
      if (existsEmail) {
        return res.status(400).send({ message: "Account with this email already exists!" });
      }
     
      if (password !== confirmPassword) {
        return res
          .status(400)
          .send({ message: "Confirm password is not the same as password!" });
      }
      req.body.password = bcrypt.hashSync(password); // password-ot e sifriran i e nerazbirliv za nas lugjeto
      const acc = await createUser(req.body);
      return res.status(201).send(acc);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    };
  };

  const login = async (req, res) => {
    console.log("I'm in login");
    try{
    const {email, password} = req.body;
    const account = await getByEmail(email);
    if(!account) {
      return res.status(400).send("Account not found!");
    }
    if (!bcrypt.compareSync(password, account.password)) {
      return res.status(400).send("Wrong password");
    }
    const payload = {
      name: account.name,
      email: account.email,
      id: account._id,
      type: account.type,
      exp: new Date().getTime() / 1000 + 7 * 24 * 60 * 60, // exparation 7 days

    };

    const token = jwt.sign(payload, `${process.env.jwt_secret}`)
    return res.status(200).send({token});
  } catch(err) {
    res.status(err.status).send(err.error);
  };
  };

  const checkEmail = async (req, res) => {
    const {email} = req.body;
    try {
      const existsEmail = await getByEmail(email);
      // check if there is user registered with this email
      console.log("Message from getByEmail: ", existsEmail);
      if (existsEmail) {
        // return res.status(200).send({ message: true });
        return res.status(200).send(true);
      } else {
        return res.status(200).send(false);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };

  const getUser = async (req, res) => {
    try {
      console.log(req.auth);
      const user = await getById(req.auth.id);
      // check if there is user registered with this email
      // console.log("Message from getUser: ", user);
        return res.status(200).send(user);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };  

  const updateUser =  async (req, res) => {
    try {
      console.log("Message from updateUser: ", req.body);
      const user = await editUser(req.auth.id, req.body);
      // check if there is user registered with this email
      const updatedUser = await getById(req.auth.id);
        return res.status(200).send(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };  

  const getAllCompanies = async (req, res) => {
    console.log(req.query,"getAllCompanies")
    try {
      const companies = await getCompanies(req.query);
        return res.status(200).send(companies);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };  

  const getAllMentors = async (req, res) => {
    try {
      const mentors = await getMentors();
        return res.status(200).send(mentors);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };  

  const getUserMentorName = async (req, res) => {
    try {
      const user = await getMentorByName(req.params.name);
        return res.status(200).send(user);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };
  
  const getUserCompanyName = async (req, res) => {
    try {
      const user = await getCompanyByName(req.params.name);
        return res.status(200).send(user);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };  

  const getCompanyById  = async (req, res) => {
    try {
      const company = await getCompanyId(req.params._id);
        return res.status(200).send(company);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };
  
  const getMentorById  = async (req, res) => {
    try {
      const company = await getMentorId(req.params._id);
        return res.status(200).send(company);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };


  module.exports = {
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
  };