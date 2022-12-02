const bcrypt = require("bcrypt");

const User = require("../../models/User");

const saltRounds = Number(process.env.SALTROUNDS);
const {
  BODY_CONSTANT,
  COMMON_CONSTANT,
  DB_OPERATION_CONSTANT,
} = require("../../../constants/constant");

const {
  handleError,
  handleSuccess,
  logger,
  validateAlphaNumericString,
  validateEmail,
} = require("../../utils");
const { generateJWT } = require("../../middlewares/JWT");

/**
 * This method verifies user provided data, by validating email and password in the request body
 * and then checking for the user's existence
 *
 * @requires {@link handleError}
 * @requires {@link handleSuccess}
 * @requires {@link logger}
 * @requires {@link validateAlphaNumericString}
 * @requires {@link validateEmail}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @returns {{message: string, status: boolean}} success response (with JWT as cookies) or error response object based on various criterias
 */
const signup = async (req, res) => {
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
    message: COMMON_CONSTANT.GENERIC_ERROR_MESSAGE,
    status: status,
  };

  /**
   * To avoid any errors, the entire code is placed in try catch block
   */
  try {
    /**
     * This is the email passed by the client in request body
     *
     * @type {string}
     * @const
     */
    const email = req.body[BODY_CONSTANT.EMAIL];

    /**
     * This is the first name passed by the client in request body
     *
     * @type {string}
     * @const
     */
    const firstName = req.body[BODY_CONSTANT.FIRST_NAME];

    /**
     * This is the last name passed by the client in request body
     *
     *  @type {string}
     * @const
     */
    const lastName = req.body[BODY_CONSTANT.LAST_NAME];

    /**
     * This is the status of the validity of first name passed by client in request body
     *
     *  @type {boolean}
     * @const
     */
    const isValidFirstName = validateAlphaNumericString(firstName);

    /**
     * This is the status of the validity of last name passed by client in request body
     *
     * @type {boolean}
     * @const
     */
    const isValidLastName = validateAlphaNumericString(lastName);

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
    const plainTextPassword = req.body[BODY_CONSTANT.PASSWORD];

    /**
     * Checking if the email and the password from request body is not valid
     */
    if (!isValidEmail) {
      response = {
        statusCode: 400,
        message: `${
          BODY_CONSTANT.EMAIL.charAt(0).toUpperCase() +
          BODY_CONSTANT.EMAIL.slice(1)
        }${COMMON_CONSTANT.INVALID_FIELD}`,
        status: false,
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
          BODY_CONSTANT.PASSWORD.charAt(0).toUpperCase() +
          BODY_CONSTANT.PASSWORD.slice(1)
        }${COMMON_CONSTANT.INVALID_FIELD}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * Checking if the first name and the last name from request body is not valid
     */
    if (!isValidFirstName || !isValidLastName) {
      response = {
        statusCode: 400,
        message: `${COMMON_CONSTANT.NAME_IS_INVALID}`,
        status: false,
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
     * Checking if the user exists, then returning an error
     */
    if (existingUser) {
      response = {
        statusCode: 422,
        message: `${DB_OPERATION_CONSTANT.USER_ALREADY_EXISTS}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * This is the hashed password that would be stored in the database
     *
     * @type {String}
     * @const
     */
    const encryptedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    /**
     * This is the new user that would be saved into the database
     *
     * @type {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId], firstName: string, lastName: string}|null)}
     * @const
     */
    const newUser = new User({
      email: email,
      password: encryptedPassword,
      firstName: firstName
        .toLowerCase()
        .replace(" ", "")
        .replace(/\b\w/g, (firstName) => firstName.toUpperCase()),
      lastName: lastName
        .toLowerCase()
        .replace(" ", "")
        .replace(/\b\w/g, (lastName) => lastName.toUpperCase()),
    });

    /**
     * This is the user document that is saved in the database
     *
     * @type {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId], firstName: string, lastName: string}|null)}
     * @const
     */
    const userAdded = await newUser.save();

    logger(userAdded);

    /**
     * Checking if the user was added to database succesfully, then returning a token to handleSuccess method , else returning an error
     */
    if (userAdded) {
      /**
       * This is the token that is generated by the generateJWT function
       *
       * @type {string}
       * @const
       */
      const token = await generateJWT(userAdded);
      status = true;
      response = {
        statusCode: 201,
        message: DB_OPERATION_CONSTANT.USER_DATA_ADDED,
        status: status,
      };
      return handleSuccess(response, res, token);
    } else {
      response = {
        statusCode: 400,
        message: `${DB_OPERATION_CONSTANT.UNABLE_TO_ADD_DATA}`,
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
      message: `${COMMON_CONSTANT.GENERIC_ERROR_MESSAGE}`,
      status: status,
    };
    return handleError(response, res);
  }
};

module.exports = { signup };
