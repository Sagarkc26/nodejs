const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const database = "e-com";
const client = new MongoClient(url);

async function getData() {
  let result = await client.connect();
  let db = result.db(database);
  let collection = db.collection("product");
  let response = await collection.find({}).toArray();
  console.log(response);
}

async function connect() {
  try {
    console.log("helo");
    await getData();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    console.log("app closed");
    await client.close();
  }
}

connect();

console.log("check");

// const { MongoClient } = require("mongodb");

// const url = "mongodb://localhost:27017"; // Replace with your MongoDB connection string
// const databaseName = "e-com"; // Replace with your database name

// async function connectToMongoDB() {
//   try {
//     // Create a new MongoClient
//     const client = new MongoClient(url);

//     // Connect to the MongoDB server
//     await client.connect();

//     // Access the database
//     const db = client.db(databaseName);

//     // Perform your database operations here

//     // Close the connection when done
//     client.close();
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// }

// connectToMongoDB();
