const express = require("express");
const axios = require("axios");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongodb");
const mongodb = require("mongodb");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bcryptj = require("bcryptjs"); // Import the bcryptjs library

const randomstring = require("randomstring");

const saltRounds = 10; // Number of salt rounds for bcrypt
const { connect } = require("http2");
const mongoose = require("mongoose");
const generateReferralCode = require("../referralcode/referralcode");
const jwt = require("jsonwebtoken");
const { error } = require("console");
const User = require("./userModel");

const templatePath = path.join(__dirname, "../templates");
const users = [];
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Replace with your SendinBlue API key
const apiKey =
  "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";

// Sendinblue API Base URL
const apiUrl = "https://api.sendinblue.com/v3/smtp/email";
//Screte key for JWT
const secretKey = "SAAZGIALR";

// Middleware to check if user is authenticated
function authenticate(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

app.get("/", (req, res) => {
  res.send(check);
});
app.get("/signup", (req, res) => {
  res.send(check);
});

//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

// app.post("/signup", async (req, res) => {
//   const { name, businessname, email, phoneno, password, confirmpassword } =
//     req.body;

//   // Check if password and confirm password match

//   if (!email || !password || !confirmpassword) {
//     return res
//       .status(409)
//       .json({ error: "Please provide all necessary filed" });
//   }
//   if (password != confirmpassword) {
//     return res.status(409).json({ error: "Password doesnot match" });
//   }

//   // if (password !== confirmpassword) {
//   //   return res.status(400).json({ error: "Passwords do not match" });
//   // }

//   const existingUser = await collection.findOne({ email });

//   if (existingUser) {
//     return res.status(409).json({ error: "User already exists" });
//   }

//   // Now you can proceed to insert the user data into the database
//   const data = {
//     name,
//     businessname,
//     email,
//     phoneno,
//     password,
//     confirmpassword,
//   };

//   const newuser = await collection.insertMany(data);
//   res.send(newuser);
// });

app.post("/signup", async (req, res) => {
  const { name, businessname, email, phoneno, password, confirmpassword } =
    req.body;

  // Check if password and confirm password match
  if (!email || !password || !confirmpassword) {
    return res
      .status(409)
      .json({ error: "Please provide all necessary fields" });
  }
  if (password !== confirmpassword) {
    return res.status(410).json({ error: "Password does not match" });
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

app.post("/login", async (req, res) => {
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
// app.post("/login", async (req, res) => {
//   try {
//     if (!req.body.email || !req.body.password) {
//       return res.status(409).send("Provide required email/password");
//     }
//     const check = await collection.findOne({
//       email: req.body.email,
//     });
//     console.log(req.body);
//     if (!req.body.email || !req.body.password) {
//       return res.status(409).send("Provide required email/password");
//     }
//     // if (!user) {
//     //   throw new UnauthenticatedError("Invalid credentials / User doesnt exist");
//     // }
//     if (check.password === req.body.password) {
//       res.send(check);
//     } else {
//       res.send("wrong password");
//     }
//   } catch (error) {
//     console.log(error);
//     res.send("wrong details");
//   }
// });

// app.delete("/deleteUsers/:id", async (req, res) => {
//   const userId = req.params.id;

//   try {
//     // Check if the user exists
//     const existingUser = await collection.findOne({
//       _id: new ObjectId(userId),
//     });

//     if (!existingUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Delete the user
//     const result = await collection.deleteOne({ _id: new ObjectId(userId) });

//     if (result.deletedCount === 1) {
//       res.status(200).json({ message: "User deleted successfully" });
//     } else {
//       res.status(500).json({ error: "Error deleting user" });
//     }
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while deleting the user" });
//   }
// });

// app.delete("/deleteUsers/:id", async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const client = new MongoClient(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await client.connect();

//     const db = client.db(LoginSignUp);
//     const collection = db.collection(logincollections);

//     const result = await collection.deleteOne({ _id: new ObjectId(userId) });

//     if (result.deletedCount === 1) {
//       res.status(200).json({ message: "User deleted successfully" });
//     } else {
//       res.status(404).json({ error: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while deleting the user" });
//   } finally {
//     client.close();
//   }
// });
// app.delete("/:id", async (req, res) => {
//   console.log(req.params.id);
//   const data = await mongoose();
//   const result = await data.deleteOne({
//     _id: new mongodb.ObjectId(req.params.id),
//   });
//   res.send(result);
// });
// Delete user account by ID
// Define a DELETE route to delete a user account by ID
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID and delete it (replace with your database logic)
    const deletedUser = await collection.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user is successfully deleted, you can send a success message
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
});
// app.delete("/users/:id", async (req, res) => {
//   const userId = req.params.id;
//   const enteredPassword = req.body.password;

//   try {
//     // Retrieve the user's hashed password from your database
//     const hashedPasswordFromDatabase = await getPasswordFromDatabase(userId);

//     if (!hashedPasswordFromDatabase) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Verify the entered password against the hashed password
//     const passwordMatch = await bcrypt.compare(
//       enteredPassword, // Corrected bcrypt.compare function
//       hashedPasswordFromDatabase
//     );

//     if (passwordMatch) {
//       // Password is correct, proceed with account deletion
//       const deletedUser = await collection.findByIdAndDelete(userId);

//       if (!deletedUser) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // If the user is successfully deleted, send a success response
//       return res.status(200).json({ message: "User deleted successfully" });
//     } else {
//       // Password is incorrect, return an error response
//       return res.status(401).json({ message: "Incorrect password" });
//     }
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while deleting the user" });
//   }
// });

// async function getPasswordFromDatabase(userId) {
//   try {
//     const user = await collection.findById(userId);
//     if (!user) {
//       return null;
//     }
//     return user.password;
//   } catch (error) {
//     console.error("Error fetching password from the database:", error);
//     throw error;
//   }
// }

// try {
//   // Find the user by ID and delete it
//   const user = await mongoose.findByIdAndDelete(userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   res.status(200).json({ message: "User deleted successfully" });
// } catch (error) {
//   console.error("Error deleting user:", error);
//   res
//     .status(500)
//     .json({ error: "An error occurred while deleting the user" });
// }

app.delete("/deleteUsers/:id", async (req, res) => {
  const userId = req.params.id;
  const providerPassword = req.body.password;

  try {
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db(LoginSignUp);
    const collection = db.collection(logincollections);

    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    //Verify provided password with hashed password
    const passwordMatch = await bcrypt.compare(providerPassword, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Password verification failed" });
      return;
    }

    const result = await collection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  } finally {
    client.close();
  }
});

app.post("/logout", (req, res) => {
  const token = req.header("Authorization");
  if (token) {
    tokenBlacklist.add(token);
  }
  res.status(200).join({ message: "Logged out successfully" });
});

// app.post("/forgot-password", (req, res) => {
//   const { email } = req.body;

//   // Find user by email (replace with your database query)
//   const user = users.find((user) => user.email === email);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // Generate a reset token and set an expiration timestamp
//   const resetToken = crypto.randomBytes(20).toString("hex");
//   user.resetToken = resetToken;
//   user.resetTokenExpires = Date.now() + 3600000; // 1 hour

//   // Send reset email (replace with your email sending logic)
//   const resetLink = `http://your-app.com/reset-password?token=${resetToken}`;
//   // sendEmail(user.email, 'Password Reset', `Click here to reset your password: ${resetLink}`);

//   res.status(200).json({ message: "Password reset link sent successfully" });
// });

// // Endpoint to reset password
// app.post("/reset-password", (req, res) => {
//   const { token, password } = req.body;

//   // Find user by reset token and check if it's still valid
//   const user = users.find(
//     (user) => user.resetToken === token && user.resetTokenExpires > Date.now()
//   );

//   if (!user) {
//     return res.status(400).json({ message: "Invalid or expired token" });
//   }

//   // Hash the new password
//   const hashedPassword = bcrypt.hashSync(password, 10);

//   // Update user's password and remove reset token
//   user.password = hashedPassword;
//   user.resetToken = undefined;
//   user.resetTokenExpires = undefined;

//   res.status(200).json({ message: "Password reset successful" });
// });
// app.post("/send-email", (req, res) => {
//   const payload = req.body;

//   transporter.sendMail(payload, (err, info) => {
//     if (err) {
//       console.error(`Error sending email: ${err}`);
//       res.status(500).json({ error: "Error sending email" });
//       return;
//     }

//     console.log(`Email sent: ${info.response}`);
//     res.status(200).json({ message: "Email sent successfully" });
//   });
// });
app.get("/referralcode", (req, res) => {
  const value = generateReferralCode(8);
  console.log(value);
  res.send(value);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// app.post("/send-email", async (req, res) => {
//   const { sender, to, subject, textContent } = req.body;

//   try {
//     const response = await axios.post(
//       "https://api.sendinblue.com/v3/smtp/email",
//       {
//         sender: sender,
//         to: to,
//         subject: subject,
//         textContent: textContent,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "api-key": apiKey,
//         },
//       }
//     );

//     console.log("Email sent successfully");
//     res.sendStatus(200);
//   } catch (error) {
//     if (error.response) {
//       console.error("Error sending email:", error.response.data);
//     } else {
//       console.error("Error sending email:", error.message);
//     }
//     res.sendStatus(500);
//   }
// });

const userOTPMap = {};
let generatedOTP = "";
function generateRandom4DigitCode() {
  let code = "";
  for (let i = 0; i < 4; i++) {
    // Generate a random digit between 0 and 9
    const randomDigit = Math.floor(Math.random() * 10);
    code += randomDigit;
  }
  generatedOTP = code;
  return code;
}

app.post("/send-otp", async (req, res) => {
  const { sender, to, subject } = req.body;
  console.log("Request Body:", req.body);
  console.log("Request Headers:", req.headers);

  if (!sender || !to || !subject) {
    console.error("Invalid request body: Missing required propertied");
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const otp = generateRandom4DigitCode();
    const response = await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: sender,
        to: to,
        subject: subject,
        htmlContent: `Your OTP code is: ${otp}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
      }
    );

    if (response.status === 201) {
      console.log("Email sent successfully");
      res.sendStatus(200);
    } else {
      console.error("Failed to send email");
      console.error("Response:", response.data);
      res.sendStatus(500);
    }
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.sendStatus(500);
  }
});

// app.post("/send-otp", async (req, res) => {
//   const { sender, to, subject } = req.body;

//   try {
//     const response = await axios.post(
//       "https://api.sendinblue.com/v3/smtp/email",
//       {
//         sender: sender,
//         to: to,
//         subject: subject,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "api-key": apiKey,
//         },
//       }
//     );

//     if (response.status === 201) {
//       console.log("Email sent successfully");
//       res.sendStatus(200);
//     } else {
//       console.error("Failed to send email");
//       console.error("Response:", response.data);
//       res.sendStatus(500);
//     }
//   } catch (error) {
//     console.error("Error sending email:", error.message);
//     res.sendStatus(500);
//   }
// });
// app.post("/send-otp", async (req, res) => {
//   const { sender, to, subject } = req.body;

//   try {
//     generatedOTP = generateRandom4DigitCode();
//     const response = await axios.post(
//       "https://api.sendinblue.com/v3/smtp/email",
//       {
//         sender: sender,
//         to: to,
//         subject: subject,
//         textContent: `OTP code is : ${generatedOTP}`,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "api-key": apiKey,
//         },
//       }
//     );

//     console.log("Email sent successfully");
//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Error sending email:", error.response.data);
//     res.sendStatus(500);
//   }
// });

app.post("/authentication-otp", (req, res) => {
  const { enteredOTP } = req.body;
  console.log("Entered OTP:", enteredOTP);
  console.log("Generated OTP:", generatedOTP);

  if (enteredOTP === generatedOTP) {
    res.json({ message: "Authentication successful" });
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    //Find the user by their email
    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Check if the newPassword and confirmPassword match
    if (newPassword != confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    //Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    //Update the user's password with the new hashed password
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ error: "An error occurred while resetting the password" });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("port connected");
});
