const express = require("express");
const app = express();

const reqFilter = (req, res, next) => {
  if (!req.query.age) {
    res.send("please provide age");
  } else if (req.query.age > 18) {
    res.send("You can access this page");
  } else {
    res.send("home page");
  }
  next();
};

app.use(reqFilter);
app.listen(5000);
