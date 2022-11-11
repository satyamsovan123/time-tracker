const JWTSecretKey = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");
const { bodyConstant, commonConstant } = require("../../constants/constant");
const { handleError, logger } = require("../utils");

/**
 * This method generates the JSON Web Token after user is authenticated
 *
 * @async This function is asynchronous
 * @param {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId]})} user is the user that was authenticated
 * @returns {string} the JWT containing encrypted user id
 */
const generateJWT = async (user) => {
  /**
   * @type {{email: string}}
   * @const
   */
  const data = {
    email: user.email,
  };
  /**
   * @type {string}
   * @const
   */
  const token = jwt.sign(data, JWTSecretKey);
  return token;
};

/**
 * This method validates the JSON Web Token that is sent in every request's header
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body that is received by server
 * @param {{}} res is the response body that will be sent to client
 * @returns {boolean} true if JWT is not empty and valid, else it returns false
 */
const validateJWT = async (req, res, next) => {
  /**
   * @type {{statusCode: number, message: string}}
   */
  let response = {
    stausCode: 500,
    message: commonConstant.GENERIC_ERROR_MESSAGE,
  };
  try {
    /**
     * @type {string}
     * @const
     */
    const token = req.header(bodyConstant["TIME_TRACKER_TOKEN"]);
    /**
     * @type {boolean}
     * @const
     */
    const verifiedUser = jwt.verify(token, JWTSecretKey);
    if (verifiedUser) {
      req[bodyConstant.CURRENT_USER] = verifiedUser;
      return next();
    }
  } catch (error) {
    logger(error);
    response = {
      statusCode: 401,
      message: commonConstant.INVALID_JWT,
    };
    return handleError(response, res);
  }
};

module.exports = { generateJWT, validateJWT };
