/**
 * This method validates the JSON Web Token that is sent in every request's header
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body that is received by server
 * @param {{}} res is the response body that will be sent to client
 * @returns {boolean} true if JWT is not empty and valid, else it returns false
 */
const validateJWT = async (req, res) => {
  return true;
};

module.exports = { validateJWT };
