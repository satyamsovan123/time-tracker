const jwt = require("jsonwebtoken");

const moment = require("moment");

const JWTSecretKey = process.env.JWT_SECRET_KEY;
const { BODY_CONSTANT, COMMON_CONSTANT } = require("../../constants/constant");

const { handleError, logger } = require("../utils");

/**
 * This function generates the JSON Web Token after user is authenticated
 *
 * @async This function is asynchronous
 * @param {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId]})} user is the user that is authenticated
 * @returns {string} the JWT containing encrypted user email
 */
const generateJWT = async (user) => {
  /**
   * This is the object that would be used to generate token
   *
   * @type {{email: string}}
   * @const
   */
  const data = {
    email: user.email,
  };

  /**
   * This is the time for current midnight
   *
   * @type {object}
   * @const
   */
  const midnight = moment(moment().format("YYYY-MM-DD") + " 23:59:59");

  /**
   * This is the current time
   *
   * @type {object}
   * @const
   */
  const currentTime = moment(new Date());

  /**
   * Getting the difference between current time and midnight in hours, and appending "h"
   *
   * @type {string}
   * @const
   */
  const durationInHours =
    moment.duration(midnight.diff(currentTime)).asHours() + "h";

  /**
   * This is the token that is returned, the token should expire after '48h', but for current infrastructure limitation, it's configured to expire every midnight
   *
   * @type {string}
   * @const
   */

  const token = jwt.sign(data, JWTSecretKey, { expiresIn: durationInHours });
  return token;
};

/**
 * This middleware function validates the JSON Web Token that is sent in every request's header
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body that is received by server
 * @param {{}} res is the response body that will be sent to client
 * @param {{}} next is the middleware that is called later on successful verification
 * @returns {{}} the control to the next middleware by calling the {@link next()} function, else it returns error if a valid JWT token is not passed in the request header
 */
const validateJWT = async (req, res, next) => {
  /**
   * This is the response that is sent to client
   *
   * @type {{statusCode: number, message: string, status: status}}
   */
  let response = {
    stausCode: 500,
    message: COMMON_CONSTANT.GENERIC_ERROR_MESSAGE,
  };

  /**
   * To avoid any errors, the entire code is placed in try catch block
   */
  try {
    /**
     * Checking if access_token is not present in the request header
     */
    if (!req.headers.hasOwnProperty(BODY_CONSTANT.ACCESS_TOKEN)) {
      response = {
        statusCode: 401,
        message: COMMON_CONSTANT.INVALID_JWT,
      };
      return handleError(response, res);
    }

    /**
     * This is the token that is received from request header sent by client
     *
     * @type {string}
     * @const
     */
    const token = req.headers[BODY_CONSTANT["ACCESS_TOKEN"]];

    /**
     * This is the status of the verification of the token
     *
     * @type {boolean}
     * @const
     */
    const verifiedUser = jwt.verify(token, JWTSecretKey);

    /**
     * Checking if the user has a verified token, the call goes to next middleware, else returning an error
     */
    if (verifiedUser) {
      req[BODY_CONSTANT.CURRENT_USER] = verifiedUser;
      return next();
    }
  } catch (error) {
    /**
     * Incase of any errors in the try block, a generic error message is returned to the user and error is logged to the console
     */
    logger(error);
    response = {
      statusCode: 401,
      message: COMMON_CONSTANT.INVALID_JWT,
    };
    return handleError(response, res);
  }
};

module.exports = { generateJWT, validateJWT };
