const User = require("../../models/User");
const { validateEmail } = require("../../middlewares/validateEmail");
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
const bcrypt = require("bcrypt");

/**
 * This method verifies user provided credentials, by validating email key and password key in the request body
 * and the checking for the user existence. Then the passwords (hashed) are matched using bycrypt
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
const signin = async (req, res) => {
  /**
   * @type {boolean}
   */
  let isSigninComplete = false;

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
    if (!userExists) {
      error = {
        statusCode: 404,
        message: `${dbOperationsConstant.USER_DOESNT_EXIST}`,
        status: false,
      };
      return handleError(error, res);
    }

    /**
     * @type {String}
     * @const
     */
    const encryptedPassword = userExists.password;

    /**
     * @type {boolean}
     * @const
     */
    const isPasswordCorrect = await bcrypt.compare(
      plainTextPassword,
      encryptedPassword
    );
    logger(isPasswordCorrect);

    if (isPasswordCorrect) {
      isSigninComplete = true;
      return res.status(200).json({
        message: commonConstant.AUTHENTICATION_SUCCESSFUL,
        status: isSigninComplete,
      });
    } else {
      error = {
        statusCode: 401,
        message: `${commonConstant.AUTHENTICATION_UNSUCCESSFUL}`,
        status: false,
      };
      return handleError(error, res);
    }
  } catch (error) {
    logger(error);
    error = {
      statusCode: 500,
      message: `${commonConstant.GENERIC_ERROR_MESSAGE}`,
      status: isSigninComplete,
    };
    return handleError(error, res);
  }
};

module.exports = { signin };
