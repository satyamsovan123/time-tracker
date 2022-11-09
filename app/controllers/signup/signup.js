const signup = async (req, res) => {
  console.log("signup route");
  res.status(200).json({ message: "signup route" });
};

module.exports = { signup };
