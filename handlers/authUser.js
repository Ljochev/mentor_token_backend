const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
    createUser,
    getByEmail,
} = require("../pkg/user");


const register = async (req, res) => {
    // se vrakja novo kreiraniot korisnik
    const {email, password, confirmPassword} = req.body;
    console.log(req.body);
    try {
      const exists = await getByEmail(email);
      // proveri dali postoi korisnik so toj email
      if (exists) {
        return res.status(400).send("Account with this email already exists!");
      }
      // proveri go confirmPassword poleto
      if (password !== confirmPassword) {
        return res
          .status(400)
          .send("Confirm password is not the same as password!");
      }
    //   req.body.password = bcrypt.hashSync(password); // password-ot e sifriran i e nerazbirliv za nas lugjeto
      const acc = await createUser(req.body);
      return res.status(201).send(acc);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send(err.error);
    }
  };

  module.exports = {
register,
  };