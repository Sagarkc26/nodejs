let a = 20;
let b = 0;

let waitingData = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(30);
  }, 2000);
});
console.log("complete exe .....");

waitingData.then((data) => {
  b = data;
  console.log(a + b);
});
