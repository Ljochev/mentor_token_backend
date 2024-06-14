const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["company", "mentor"],
        required: true,
      },
    
    },
    { timestamps: true }
  );

const User = mongoose.model("User", userSchema, "users");


const createUser = async (account) => {
    console.log("In createUser: ",account);
    const user = new User(account);
    return await user.save();
};

const getByEmail = async (email) => {
    return await User.findOne({ email });
  };

module.exports = {
    createUser,
    getByEmail,
};