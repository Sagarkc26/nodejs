const fs = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "crud");

const pathDir = `${dirPath}/text.txt`;

//create file
fs.writeFileSync(pathDir, "This is a text file.....");

//read file
fs.readFile(pathDir, "utf8", (err, item) => {
  console.log(item);
});

//update
fs.appendFile(pathDir, "and file name is text.txt", (err) => {
  if (!err) {
    console.log("file is updated");
  }
});

//rename
fs.rename(pathDir, `${dirPath}/fruit.txt`, (err) => {
  if (!err) console.log("file name is updated");
});
//delete
fs.unlinkSync(`${dirPath}/text.txt`);
