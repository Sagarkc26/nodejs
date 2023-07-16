const fs = require("fs");

fs.writeFileSync("hello.txt", "code step by stem");

console.log("->>", __dirname);
console.log("->>", __filename);

fs.writeFileSync("hlo.txt", "coding is life");
