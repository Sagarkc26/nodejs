const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Use bodyParser middleware to parse request bodies
app.use(bodyParser.json());

// Set up mongoose connection to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/rating_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Rating = mongoose.model("Rating", {
  itemId: String,
  rating: Number,
});

// Define a POST route to handle rating submissions
app.post("/submitRating", async (req, res) => {
  const { itemId, rating } = req.body;

  try {
    if (!itemId || !rating) {
      return res
        .status(400)
        .json({ message: "Both itemId and rating are required" });
    }

    const newRating = new Rating({
      itemId,
      rating,
    });

    await newRating.save();

    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting rating" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
