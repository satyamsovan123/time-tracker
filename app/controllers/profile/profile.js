/**
 * This method
 *
 * @param {*} req is the request body that is received by server
 * @param {*} res is the response body that will be sent to client
 * @returns success response or error response based on various criterias
 */
const profile = async (req, res) => {
  console.log("profile route");
  res.status(200).json({ message: "profile route" });
};

/**
 * This method
 *
 * @param {*} req is the request body that is received by server
 * @param {*} res is the response body that will be sent to client
 * @returns success response or error response based on various criterias
 */
const deleteProfile = async (req, res) => {
  console.log("delete profile route");
  res.status(200).json({ message: "delete profile route" });
};

module.exports = { profile, deleteProfile };
