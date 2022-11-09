const signin = async (req, res) => {
  console.log("signin route");
  res.status(200).json({ message: "signin route" });
};

module.exports = { signin };
