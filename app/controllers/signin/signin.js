const User = require("../../models/User");
const { validateEmail } = require("../../utils/validateEmail");
const {
  commonConstant,
  dbOperationsConstant,
  bodyConstant,
} = require("../../../constants/constant");
const { logger } = require("../../utils/logger");
const bcrypt = require("bcrypt");
const { handleSuccess, handleError } = require("../../utils");
const { generateJWT } = require("../../middlewares/JWT");

/**
 * This method verifies user provided credentials, by validating email key and password key in the request body
 * and the checking for the user existence. Then the passwords (hashed) are matched using bycrypt
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
const signin = async (req, res) => {
  /**
   * @type {boolean}
   */
  let isSigninComplete = false;

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
        status: isSigninComplete,
      };
      return handleError(response, res);
    }

    /**
     * @type {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId], firstName: string, lastName: string}|null)}
     * @const
     */
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      response = {
        statusCode: 404,
        message: `${dbOperationsConstant.USER_DOESNT_EXIST}`,
        status: isSigninComplete,
      };
      return handleError(response, res);
    }

    /**
     * @type {String}
     * @const
     */
    const encryptedPassword = existingUser.password;

    /**
     * @type {boolean}
     * @const
     */
    const isPasswordCorrect = await bcrypt.compare(
      plainTextPassword,
      encryptedPassword
    );

    if (isPasswordCorrect) {
      const token = await generateJWT(existingUser);
      isSigninComplete = true;
      response = {
        statusCode: 200,
        message: commonConstant.AUTHENTICATION_SUCCESSFUL,
        status: isSigninComplete,
      };
      return handleSuccess(response, res, token);
    } else {
      response = {
        statusCode: 401,
        message: `${commonConstant.AUTHENTICATION_UNSUCCESSFUL}`,
        status: isSigninComplete,
      };
      return handleError(response, res);
    }
  } catch (error) {
    logger(error);
    response = {
      statusCode: 500,
      message: `${commonConstant.GENERIC_ERROR_MESSAGE}`,
      status: isSigninComplete,
    };
    return handleError(response, res);
  }
};

module.exports = { signin };
