function generateRandom4DigitCode() {
  let code = "";
  for (let i = 0; i < 4; i++) {
    // Generate a random digit between 0 and 9
    const randomDigit = Math.floor(Math.random() * 10);
    code += randomDigit;
  }
  return code;
}

// Generate a random 4-digit code using digits 0-9
const randomCode = generateRandom4DigitCode();
console.log(randomCode);

module.exports = generateRandom4DigitCode;
