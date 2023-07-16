const app = require("./app");

// console.log(app.x);
// console.log(app.y);
// console.log(app.z());

const arr = [8, 12, 7, 6, 23, 9, 6];
let result = arr.filter((item) => {
  return item > 6;
});

console.log(result);
