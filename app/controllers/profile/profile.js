const profile = async (req, res) => {
  console.log("profile route");
  res.status(200).json({ message: "profile route" });
};
const deleteProfile = async (req, res) => {
  console.log("delete profile route");
  res.status(200).json({ message: "delete profile route" });
};

module.exports = { profile, deleteProfile };
