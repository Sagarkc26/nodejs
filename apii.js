// const express = require("express");
// const dbConnect = require("./mongodb");
// const app = express();

// app.use(express.json());

// app.get("/", async (req, res) => {
//   let data = await dbConnect();
//   data = await data.find().toArray();
//   console.log(data);
//   res.send(data);
// });

// app.post("/", async (req, res) => {
//   let data = await dbConnect();
//   let result = await data.insert(req.body);
//   res.send(result);
// });
// app.listen(5000);

const express = require("express");
const app = express();
const data = require("./data");

app.get("/", (req, res) => {
  res.send(data);
});

app.listen(5000);
