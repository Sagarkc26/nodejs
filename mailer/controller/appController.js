const signup = (req, res) => {
  res.status(201).json("Signup Succressfully....!");
};

const getbill = (req, res) => {
  res.status(201).json("getBill Successfully...!");
};

module.exports = {
  signup,
  getbill,
};
