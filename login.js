// app.js
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mongodb = require("mongodb");

const app = express();
const port = 3000;

// Connect to MongoDB (make sure MongoDB is running)
const MongoClient = mongodb.MongoClient;
const mongoURL = "mongodb://127.0.0.1:27017";
const dbName = "Register";
let db;

MongoClient.connect(
  mongoURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      console.error("Error connecting to MongoDB:", err);
      return;
    }
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  }
);

app.use(bodyParser.json());

// Signup route
app.post("/signup", (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // Check if the user already exists
  db.collection("users").findOne({ username }, (err, user) => {
    if (user) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Hash the password before storing it in the database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Failed to create user" });
      }

      // Create the user record in the database
      db.collection("users").insertOne(
        { username, password: hashedPassword },
        (err, result) => {
          if (err) {
            console.error("Error creating user:", err);
            return res.status(500).json({ error: "Failed to create user" });
          }

          res.status(201).json({ message: "User created successfully" });
        }
      );
    });
  });
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  db.collection("users").findOne({ username }, (err, user) => {
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password stored in the database
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ error: "Failed to log in" });
      }

      if (result === true) {
        // Passwords match, user is authenticated
        return res.status(200).json({ message: "Login successful" });
      } else {
        // Passwords do not match
        return res.status(401).json({ error: "Invalid credentials" });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
