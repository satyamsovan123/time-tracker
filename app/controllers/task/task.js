/**
 * This method
 *
 * @param {*} req is the request body that is received by server
 * @param {*} res is the response body that will be sent to client
 * @returns success response or error response based on various criterias
 */
const updateTask = async (req, res) => {
  console.log("update task route");
  res.status(200).json({ message: "update task route" });
};

/**
 * This method
 *
 * @param {*} req is the request body that is received by server
 * @param {*} res is the response body that will be sent to client
 * @returns success response or error response based on various criterias
 */
const currentTask = async (req, res) => {
  console.log("current task route");
  res.status(200).json({ message: "current task route" });
};

module.exports = { currentTask, updateTask };
