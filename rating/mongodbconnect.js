const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/ratings_db")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed to connect");
  });

const collection = new mongoose.model("ratings_db", LogInSchema);

module.exports = collection;
