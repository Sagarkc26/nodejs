const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/LoginSignUp")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed to connect");
  });

const LogInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  businessname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneno: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    require: true,
  },
  referralCode: {
    type: String,
    require: true,
  },
});

const collection = new mongoose.model("logincollections", LogInSchema);

module.exports = collection;
