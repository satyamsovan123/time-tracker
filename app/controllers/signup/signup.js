const User = require("../../models/User");
const { validateEmail } = require("../../utils/validateEmail");
const saltRounds = Number(process.env.SALTROUNDS);
const bcrypt = require("bcrypt");
const {
  commonConstant,
  dbOperationsConstant,
  bodyConstant,
} = require("../../../constants/constant");
const { logger } = require("../../utils/logger");
const {
  handleError,
  handleSuccess,
  validateAlphaNumericString,
} = require("../../utils");
const { generateJWT } = require("../../middlewares/JWT");

/**
 * This method verifies user provided data, by validating email key and password key in the request body
 * and the checking for the user's existence
 *
 * @requires {@link validateEmail}
 * @requires {@link handleError}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @returns {{message: string, status: boolean}} success response (with JWT as cookies) or error response object based on various criterias
 */
const signup = async (req, res) => {
  /**
   * @type {boolean}
   */
  let isSignupComplete = false;

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
    const email = req.body[bodyConstant.EMAIL];
    const firstName = req.body[bodyConstant.FIRST_NAME];
    const lastName = req.body[bodyConstant.LAST_NAME];

    /**
     * @type {boolean}
     * @const
     */
    const isValidFirstName = validateAlphaNumericString(firstName);

    /**
     * @type {boolean}
     * @const
     */
    const isValidLastName = validateAlphaNumericString(lastName);

    /**
     * @type {boolean}
     * @const
     */
    const isValidEmail = validateEmail(email);

    /**
     * @type {string}
     * @const
     */
    const plainTextPassword = req.body[bodyConstant.PASSWORD];

    if (!isValidEmail) {
      response = {
        statusCode: 400,
        message: `${
          bodyConstant.EMAIL.charAt(0).toUpperCase() +
          bodyConstant.EMAIL.slice(1)
        }${commonConstant.INVALID_FIELD}`,
        status: false,
      };
      return handleError(response, res);
    }

    if (!isValidFirstName || !isValidLastName) {
      response = {
        statusCode: 400,
        message: `${commonConstant.NAME_IS_INVALID}`,
        status: false,
      };
      return handleError(response, res);
    }

    /**
     * @type {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId], firstName: string, lastName: string}|null)}
     * @const
     */
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      response = {
        statusCode: 422,
        message: `${dbOperationsConstant.USER_ALREADY_EXISTS}`,
        status: isSignupComplete,
      };
      return handleError(response, res);
    }

    /**
     * @type {String}
     * @const
     */
    const encryptedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    /**
     * @type {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId], firstName: string, lastName: string}|null)}
     * @const
     */
    const newUser = new User({
      email: email,
      password: encryptedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    /**
     * @type {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId], firstName: string, lastName: string}|null)}
     * @const
     */
    const userAdded = await newUser.save();
    if (userAdded) {
      const token = await generateJWT(userAdded);
      isSignupComplete = true;
      response = {
        statusCode: 201,
        message: dbOperationsConstant.DATA_ADDED,
        status: isSignupComplete,
      };
      return handleSuccess(response, res, token);
    } else {
      response = {
        statusCode: 400,
        message: `${dbOperationsConstant.UNABLE_TO_ADD_DATA}`,
        status: isSignupComplete,
      };
      return handleError(response, res);
    }
  } catch (error) {
    logger(error);
    response = {
      statusCode: 500,
      message: `${commonConstant.GENERIC_ERROR_MESSAGE}`,
      status: isSignupComplete,
    };
    return handleError(response, res);
  }
};

module.exports = { signup };
