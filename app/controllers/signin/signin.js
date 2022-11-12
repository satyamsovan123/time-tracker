const bcrypt = require("bcrypt");

const { User } = require("../../models");

const {
  commonConstant,
  dbOperationsConstant,
  bodyConstant,
} = require("../../../constants/constant");

const {
  handleError,
  handleSuccess,
  logger,
  validateEmail,
} = require("../../utils");
const { generateJWT } = require("../../middlewares/JWT");

/**
 * This method verifies user provided credentials, by validating email and password in the request body
 * and then checking for the user existence. Then the entered plaintext password and hased databased passwords are matched using bycrypt
 *
 * @requires {@link handleError}
 * @requires {@link handleSuccess}
 * @requires {@link logger}
 * @requires {@link validateEmail}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @returns {{message: string, status: boolean}} success response (with JWT as cookies) or error response object based on various criterias
 */
const signin = async (req, res) => {
  /**
   * This is the status of the current operation
   *
   * @type {boolean}
   */
  let status = false;

  /**
   * This is the response that is sent to client
   *
   * @type {{statusCode: number, message: string, status: status}}
   */
  let response = {
    stausCode: 500,
    message: commonConstant.GENERIC_ERROR_MESSAGE,
    status: status,
  };

  /**
   * To avoid any errors, the entire code is placed in try catch block
   */
  try {
    /**
     * This is the email passed by the client in request body
     *
     *  @type {string}
     * @const
     */
    const email = req.body[bodyConstant.EMAIL];

    /**
     * This is the status of the validity of email passed by client in request body
     *
     * @type {boolean}
     * @const
     */
    const isValidEmail = validateEmail(email);

    /**
     * This is the password in plain text (not ecrypted) passed by the client in request body
     *
     * @type {string}
     * @const
     */
    const plainTextPassword = req.body[bodyConstant.PASSWORD];

    /**
     * Checking if the email from request body is not valid
     */
    if (!isValidEmail) {
      response = {
        statusCode: 400,
        message: `${
          bodyConstant.EMAIL.charAt(0).toUpperCase() +
          bodyConstant.EMAIL.slice(1)
        }${commonConstant.INVALID_FIELD}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * Checking if the password from request body is not valid
     */
    if (!plainTextPassword || !plainTextPassword.length) {
      response = {
        statusCode: 400,
        message: `${
          bodyConstant.PASSWORD.charAt(0).toUpperCase() +
          bodyConstant.PASSWORD.slice(1)
        }${commonConstant.INVALID_FIELD}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * This is the user document that is fetched after querying from the database
     *
     * @type {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId]}|null)}
     * @const
     */
    const existingUser = await User.findOne({ email: email });

    /**
     * Checking if the user doesn't exists, then returning an error
     */
    if (!existingUser) {
      response = {
        statusCode: 404,
        message: `${dbOperationsConstant.USER_DOESNT_EXIST}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * This is the hashed password that is stored in the database
     *
     * @type {String}
     * @const
     */
    const encryptedPassword = existingUser.password;

    /**
     * This is the status of the comparision of the hased password and the user entered password
     *
     * @type {boolean}
     * @const
     */
    const isPasswordCorrect = await bcrypt.compare(
      plainTextPassword,
      encryptedPassword
    );

    /**
     * Checking if the password comparision is true, then generating and returning a token to handleSuccess method, else returning an error
     */
    if (isPasswordCorrect) {
      /**
       * This is the token that is generated by the generateJWT function
       *
       * @type {string}
       * @const
       */
      const token = await generateJWT(existingUser);
      status = true;
      response = {
        statusCode: 200,
        message: commonConstant.AUTHENTICATION_SUCCESSFUL,
        status: status,
      };

      logger(token);
      return handleSuccess(response, res, token);
    } else {
      response = {
        statusCode: 401,
        message: `${commonConstant.AUTHENTICATION_UNSUCCESSFUL}`,
        status: status,
      };
      return handleError(response, res);
    }
  } catch (error) {
    /**
     * Incase of any errors in the try block, a generic error message is returned to the user and error is logged to the console
     */
    logger(error);
    response = {
      statusCode: 500,
      message: `${commonConstant.GENERIC_ERROR_MESSAGE}`,
      status: status,
    };
    return handleError(response, res);
  }
};

module.exports = { signin };
