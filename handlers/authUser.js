const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
    createUser,
    getByEmail,
} = require("../pkg/user");


const register = async (req, res) => {
  console.log("I'm in register");

    // se vrakja novo kreiraniot korisnik
    const {email, password, confirmPassword} = req.body;
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
      req.body.password = bcrypt.hashSync(password); // password-ot e sifriran i e nerazbirliv za nas lugjeto
      const acc = await createUser(req.body);
      return res.status(201).send(acc);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send(err.error);
    }
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
      username: account.username,
      email: account.email,
      id: account._id,
      role: account.role,
      exp: new Date().getTime() / 1000 + 24 * 60 * 60, // exparation 24h
    };

    const token = jwt.sign(payload, `${process.env.jwt_secret}`)
    return res.status(200).send({token});
  } catch(err) {
    res.status(err.status).send(err.error);
  }
  }



  module.exports = {
register,
login,
  };