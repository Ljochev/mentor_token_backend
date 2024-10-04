const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('node:crypto');
const sendEmail = require('../sendEmail.js');

const {
  newUserValidate,
  updateUserValidate,
  updatePasswordValidate,
  validateUser,
} = require("../pkg/user/validateUser.js");

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
        await validateUser(req.body, newUserValidate);
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
      req.body.password = bcrypt.hashSync(password); // password is encoded and its unreadable for human
      const acc = await createUser(req.body);
      return res.status(201).send(acc);

      } catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Internal Server Error" });
      };
    };
 
    const updateUser =  async (req, res) => {
      try {
        await validateUser(req.body, updateUserValidate);
        let updatedUser = await getById(req.auth.id);
        if(updatedUser) 
          { 
            await editUser(req.auth.id, req.body);
            updatedUser = await getById(req.auth.id);
          return res.status(200).send(updatedUser); 
          } else { 
            return res.status(400).send("Account not found!"); 
          }
      } catch (err) {
      console.log(err);
        return res.status(500).send({ error: "Internal Server Error" });
      }
    };  

  const login = async (req, res) => {
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
    const token = jwt.sign(payload, `${process.env.jwt_secret}`); // jwt token is created
    return res.status(200).send({token});
  } catch(err) {
    console.log(err);
    res.status(err.status).send(err.error);
  };
  };

  const checkEmail = async (req, res) => {
    const {email} = req.body;
    try {
      const existsEmail = await getByEmail(email);
      // check if there is user registered with this email
      if (existsEmail) {
        return res.status(200).send(true);
      } else {
        return res.status(200).send(false);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };

  const passwordLink = async (req, res) => {
    const {email} = req.body;
    try {
      const existsEmail = await getByEmail(email);
      // check if there is user registered with this email
      if (existsEmail) {
          const objectData = {
            id: existsEmail._id,
            exp: new Date().getTime() / 1000 + 15 * 60
          }
        const key = crypto.createHash('sha512').update(process.env.aes_256_secret).digest('hex').substring(0,32);
        const encIv = crypto.createHash('sha512').update(process.env.secretIV).digest('hex').substring(0,16);
        
          const cipher = crypto.createCipheriv(process.env.encMethod, key, encIv);
          const encrypted = cipher.update(JSON.stringify(objectData), 'utf8', 'hex') + cipher.final('hex');
          const token =  Buffer.from(encrypted).toString('base64');

         const emailSendResponse = await sendEmail(
          email,
          "Mentor Token Password Reset",
          "resetEmail",
          token
          );

        return res.status(200).send(emailSendResponse);
      } else {
        return res.status(200).send(false);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };

  const checkResetEmail = async (req, res) => {
    try {
      const key = crypto.createHash('sha512').update(process.env.aes_256_secret).digest('hex').substring(0,32);
        const encIv = crypto.createHash('sha512').update(process.env.secretIV).digest('hex').substring(0,16);
        
            const buff = Buffer.from(req.params.resetToken, 'base64');
            const  newEncryptedData = buff.toString('utf-8');
            const decipher = crypto.createDecipheriv(process.env.encMethod, key, encIv);
            const decoded =  decipher.update(newEncryptedData, 'hex', 'utf8') + decipher.final('utf8');

            const decodedParsed = JSON.parse(decoded);
            const user = await getById(decodedParsed.id);

        return res.status(200).send({email: user.email, exparation: decodedParsed.exp});
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };


  const resetUserPassword = async (req, res) => {
    try {
      await validateUser(req.body, updatePasswordValidate);
      const {newPassword, confirmNewPassword} = req.body;

      const key = crypto.createHash('sha512').update(process.env.aes_256_secret).digest('hex').substring(0,32);
        const encIv = crypto.createHash('sha512').update(process.env.secretIV).digest('hex').substring(0,16);
        
            const buff = Buffer.from(req.params.resetToken, 'base64');
            const  newEncryptedData = buff.toString('utf-8');
            const decipher = crypto.createDecipheriv(process.env.encMethod, key, encIv);
            const decoded =  decipher.update(newEncryptedData, 'hex', 'utf8') + decipher.final('utf8');

            const decodedParsed = JSON.parse(decoded);

            if (decodedParsed && decodedParsed.exp + 30 >= new Date().getTime()/1000) {
              if (newPassword !== confirmNewPassword) {
                return res
                  .status(422)
                  .send({ status: false,  message: "The passwords you entered do not match. Please try again." });
              } else {
              const user = await getById(decodedParsed.id);
              if (bcrypt.compareSync(newPassword, user.password)) {
                return res
                  .status(422)
                  .send({ status: false,  message: "New password cannot be the same as the old password! try again!" });
              }
                const newPasswordReset = bcrypt.hashSync(newPassword); // password is encoded and its unreadable for human
                await editUser(decodedParsed.id,{password: newPasswordReset});
                return res
                .status(200)
                .send({ status: true,  message: "Password has been updated, please login!" });
              }
            }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };

  const getUser = async (req, res) => {
    try {
      const user = await getById(req.auth.id);
      // check if there is user registered with this email
      if(user) {
        return res.status(200).send(user);
      } else {
        return res.status(400).send("Account not found!");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };  


  const getAllCompanies = async (req, res) => {
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
passwordLink,
checkResetEmail,
resetUserPassword,
getUser,
updateUser,
getAllCompanies,
getAllMentors,
getUserMentorName,
getUserCompanyName,
getCompanyById,
getMentorById,
  };