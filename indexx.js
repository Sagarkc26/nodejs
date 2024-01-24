const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const connectDb = require("./connect");

const app = express();

app.get("/sagar", (req, res) => {
  res.send("eat geada");
});

// app.use(express.static(publicPath));

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await connectDb("mongodb://127.0.0.1:27017/e-com");
    app.listen(3000, () => {
      console.log(`listening on port 3000`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
