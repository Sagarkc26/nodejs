const express = require("express");
const router = express.Router();
const collection = require("./mongodb");
const { ObjectId } = require("mongodb");

// Delete user route
router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if the user exists
    const existingUser = await collection.findOne({
      _id: new ObjectId(userId),
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    const result = await collection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(500).json({ error: "Error deleting user" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
});

module.exports = router;
