const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      password: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["company", "mentor"],
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
        default: '',
      },
      role: {
        type: String,
        required: function() {
          return this.type === 'mentor';
        },
        default: function() {
            return this.type === 'mentor' ? '' : undefined;
          }
      },
      skills: {
        type: [String],
        required: function() {
          return this.type === 'mentor';
        },
        default: function() {
            return this.type === 'mentor' ? [] : undefined;
          }
      },
      desc: {
        type: String,
        required: function() {
          return this.type === 'mentor';
        },
        default: function() {
            return this.type === 'mentor' ? '' : undefined;
          }
      },
      acceptedJobs: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: function() {
          return this.type === 'mentor';
        },
        default: function() {
            return this.type === 'mentor' ? [] : undefined;
          }
      },
      representative: {
        type: String,
        required: function() {
          return this.type === 'company';
        },
        default: function() {
            return this.type === 'company' ? '' : undefined;
          }
      },
      address: {
        type: String,
        required: function() {
          return this.type === 'company';
        },
        default: function() {
            return this.type === 'company' ? '' : undefined;
          }
      },
      jobsPosted: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: function() {
          return this.type === 'company';
        },
        default: function() {
            return this.type === 'company' ? [] : undefined;
          }
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
const editUser = async (_id, account) => {
  console.log("I'm in edit user and the updated user is:", account)
  return await User.updateOne({_id}, account);
};

const getByEmail = async (email) => {
    return await User.findOne({ email });
  };

  const getById = async (_id) => {
    return await User.findOne({_id});
  };

  const getCompanies = async (query) => {
    return await User.find({...{type: 'company'},...query});
  };

  const getMentors = async (query) => {
    return await User.find({...{type: 'mentor'},...query});

  };

  const getMentorByName = async (query) => {
    const regex = new RegExp(query, 'i');
    return await User.find({type: 'mentor',name: {$regex: regex}});

  };

  const getCompanyByName = async (query) => {
    console.log(query)
    const regex = new RegExp(query, 'i');
    return await User.find({type: 'company',name: {$regex: regex}});

  };

  const getCompanyId = async (_id) => {
return await User.findOne({type: 'company',_id});
  };

  const getMentorId = async (_id) => {
    return await User.findOne({type: 'mentor',_id});
    
      };
  
  

module.exports = {
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
};