const http = require("http");

function datatransfer(req, res) {
  res.write("Hi, everyone");
  res.end();
}

http.createServer(datatransfer).listen(4000);
