const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const users = [
  { id: 1, email: "user@example.com", password: "hashed_password_here" },
];
app.post("/resetPassword", async (req, res) => {
  const { email, newPassword } = req.body;

  //find user by email

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  //Hashed the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  //Update user's password in the database
  user.password = hashedPassword;

  return res.status(200).json({ message: "Password reset successful" });
});
