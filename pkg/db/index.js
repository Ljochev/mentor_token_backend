const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.coopvs9.mongodb.net/mentor_token?retryWrites=true&w=majority&appName=Cluster0`;

const connect = async () => {
    // console.log(uri);
try {
await mongoose.connect(uri);
console.log("Mongoose is connected with mongoDB");
} catch (err) {
    console.error(err.message);
}
};

connect();