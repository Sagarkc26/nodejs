const express = require("express");
const app = express();
const data = require("./expressdata");

app.get("", (req, res) => {
  console.log("Data send by browser =>>>", req.query.name);
  res.send("Hello, " + req.query.name);
});

app.get("/about", (req, res) => {
  res.send(`
  <input type="text" placeholder="Username" value=' ${req.query.name}'/>
  <button>Click Me</button>
  `);
});

app.get("/image", (req, res) => {
  res.send("This is image page");
});

app.listen(3000);
