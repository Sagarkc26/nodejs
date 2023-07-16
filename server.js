const http = require("http");

function dataControl(req, res) {
  res.write("<h1>Hello this is Sagar K.C.</h1>");
  res.end();
}

http.createServer(dataControl).listen(4500);
