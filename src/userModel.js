const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  businessname: String,
  email: String,
  phoneno: String,
  password: String,
  confirmpassword: String,
  referralCode: String,
});
const User = mongoose.model("User", userSchema);
module.exports = User;
