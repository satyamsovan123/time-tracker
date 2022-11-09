const updateTask = async (req, res) => {
  console.log("update task route");
  res.status(200).json({ message: "update task route" });
};
const currentTask = async (req, res) => {
  console.log("current task route");
  res.status(200).json({ message: "current task route" });
};

module.exports = { currentTask, updateTask };
