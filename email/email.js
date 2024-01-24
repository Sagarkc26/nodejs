// const express = require("express");
// const sgMail = require("@sendgrid/mail");

// const app = express();
// app.use(express.json());

// const SENDGRID_API_KEY =
//   "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"; // Replace with your SendGrid API key
// sgMail.setApiKey(SENDGRID_API_KEY);

// app.post("/send-email", async (req, res) => {
//   try {
//     const { to, subject, text } = req.body;

//     const msg = {
//       to,
//       from: "sagarkc45172@gmail.com",
//       subject,
//       text,
//     };

//     await sgMail.send(msg);

//     res.status(200).json({ message: "Email sent successfully" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while sending the email" });
//   }
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: "email", // e.g., 'Gmail', 'Outlook', etc.
    auth: {
      user: "sagarmurphys@gmail.com",
      pass: "Sagar@(172)",
    },
  });

  const mailOptions = {
    from: "sagarkc45172@gmail.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
