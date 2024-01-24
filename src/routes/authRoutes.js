const express = require("express");
const router = express.Router();
const collection = require("./mongodb");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretKey = "SAAZGIALR";

// Signup route
router.post("/signup", async (req, res) => {
  const { name, businessname, email, phoneno, password, confirmpassword } =
    req.body;

  // Check if password and confirm password match
  if (!email || !password || !confirmpassword) {
    return res
      .status(409)
      .json({ error: "Please provide all necessary fields" });
  }
  if (password !== confirmpassword) {
    return res.status(409).json({ error: "Password does not match" });
  }

  const existingUser = await collection.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  try {
    const referralCode = generateReferralCode(8);
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data = {
      name,
      businessname,
      email,
      phoneno,
      password: hashedPassword,
      confirmpassword: hashedPassword,
      referralCode,
    };

    const newuser = await collection.insertMany(data);
    res.status(201).json(newuser);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide both email and password" });
  }

  try {
    // Find user by email
    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare hashed password with entered password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    //Generate JWT token
    const token = jwt.sign({ user: user._id }, secretKey, { expiresIn: "1h" });

    // Successful login
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
});

module.exports = router;
