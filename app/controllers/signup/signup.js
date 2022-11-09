const User = require("../../models/User");
const { validateEmail } = require("../../middlewares/validateEmail");
const saltRounds = Number(process.env.SALTROUNDS);
const bcrypt = require("bcrypt");
const {
  validateRequestBody,
} = require("../../middlewares/validateRequestBody");
const {
  commonConstant,
  dbOperationsConstant,
  bodyConstant,
} = require("../../../constants/constant");

const { handleError } = require("../../middlewares/handleError");
const { logger } = require("../../utils/logger");

/**
 * This method verifies user provided data, by validating email key and password key in the request body
 * and the checking for the user's existence
 *
 * @requires {@link validateEmail}
 * @requires {@link validateRequestBody}
 * @requires {@link handleError}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @returns {{message: string, status: boolean }} success response or error response object based on various criterias
 */
const signup = async (req, res) => {
  /**
   * @type {boolean}
   */
  let isSignupComplete = false;

  /**
   * @type {{statusCode: number, message: string}}
   */
  let error = {
    stausCode: 500,
    message: commonConstant.GENERIC_ERROR_MESSAGE,
  };
  try {
    /**
     * @type {boolean}
     * @const
     */
    const isValidRequestBody = validateRequestBody(req.body);

    if (!isValidRequestBody) {
      error = {
        statusCode: 400,
        message: `${commonConstant.INVALID_BODY}`,
        status: false,
      };
      return handleError(error, res);
    }

    /**
     * @type {string}
     * @const
     */
    const email = req.body[bodyConstant.EMAIL];

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
      error = {
        statusCode: 400,
        message: `${
          bodyConstant.EMAIL.charAt(0).toUpperCase() +
          bodyConstant.EMAIL.slice(1)
        }${commonConstant.INVALID_FIELD}`,
        status: false,
      };
      return handleError(error, res);
    }

    /**
     * @type {({_id: ObjectId, email: string, password: string, currentData: [ObjectId]}|null)}
     * @const
     */
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      error = {
        statusCode: 422,
        message: `${dbOperationsConstant.USER_ALREADY_EXISTS}`,
        status: false,
      };
      return handleError(error, res);
    }

    /**
     * @type {String}
     * @const
     */
    const encryptedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    /**
     * @type {({_id: ObjectId, email: string, password: string, currentData: [ObjectId]}|null)}
     * @const
     */
    const newUser = new User({
      email: email,
      password: encryptedPassword,
    });

    /**
     * @type {({_id: ObjectId, email: string, password: string, currentData: [ObjectId]}|null)}
     * @const
     */
    const isUserAdded = await newUser.save();
    if (isUserAdded) {
      isSignupComplete = true;
      return res.status(201).json({
        message: dbOperationsConstant.DATA_ADDED,
        status: isSignupComplete,
      });
    } else {
      error = {
        statusCode: 400,
        message: `${dbOperationsConstant.UNABLE_TO_ADD_DATA}`,
        status: isSignupComplete,
      };
      return handleError(error, res);
    }
  } catch (error) {
    logger(error);
    error = {
      statusCode: 500,
      message: `${commonConstant.GENERIC_ERROR_MESSAGE}`,
      status: isSignupComplete,
    };
    return handleError(error, res);
  }
};

module.exports = { signup };
