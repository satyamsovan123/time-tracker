const { Task, User } = require("../../models");

const {
  BODY_CONSTANT,
  COMMON_CONSTANT,
  DB_OPERATION_CONSTANT,
} = require("../../../constants/constant");

const {
  handleError,
  handleSuccess,
  logger,
  validateEmail,
} = require("../../utils");

/**
 * This method returns the details for an authenticated user
 *
 * @requires {@link handleError}
 * @requires {@link handleSuccess}
 * @requires {@link logger}
 * @requires {@link validateEmail}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body that is received by server, it has email in the req.body and userEmailInHeader (custom property) passed by the validateJWT middleware
 * @param {{}} res is the response body that will be sent to client
 * @returns {{message: string, status: boolean}} success response with data or error response object based on various criterias
 */
const profile = async (req, res) => {
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
     * This is the email passed the validateJWT middleware
     *
     * @type {string}
     * @const
     */
    const userEmailInHeader =
      req[BODY_CONSTANT.CURRENT_USER][BODY_CONSTANT.EMAIL];

    /**
     * This is the status of the validity of email passed by client in request body
     *
     * @type {boolean}
     * @const
     */
    const isValidEmail = validateEmail(email);

    /**
     * Checking if the email from request body is not valid and if it is not same as the email passed by the validateJWT middleware
     */
    if (!isValidEmail || email !== userEmailInHeader) {
      response = {
        statusCode: 401,
        message: `${
          BODY_CONSTANT.EMAIL.charAt(0).toUpperCase() +
          BODY_CONSTANT.EMAIL.slice(1)
        }${COMMON_CONSTANT.INVALID_FIELD}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * This is the user document that is fetched after querying from the database (only selecting required properties)
     *
     * @type {({_id: ObjectId, email: string, password: string, currentTask: [ObjectId]}|null)}
     * @const
     */
    const existingUser = await User.findOne({
      email: userEmailInHeader,
    }).select("-_id firstName lastName currentTask");

    logger(existingUser);

    /**
     * Checking if the user doesn't exists, then returning an error, else returning back the user document
     */
    if (!existingUser) {
      response = {
        statusCode: 404,
        message: `${DB_OPERATION_CONSTANT.USER_DOESNT_EXIST}`,
        status: status,
      };
      return handleError(response, res);
    } else {
      status = true;

      response = {
        data: existingUser,
        statusCode: 200,
        message: DB_OPERATION_CONSTANT.DATA_RETRIEVED,
        status: status,
      };
      return handleSuccess(response, res);
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

/**
 * This method deletes the user and the realted details from the database
 *
 * @requires {@link handleError}
 * @requires {@link handleSuccess}
 * @requires {@link logger}
 * @requires {@link validateEmail}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body that is received by server, it has email in the req.body and userEmailInHeader (custom property) passed by the validateJWT middleware
 * @param {{}} res is the response body that will be sent to client
 * @returns {{message: string, status: boolean}} success response or error response object based on various criterias
 */
const deleteProfile = async (req, res) => {
  /**
   * This is the status of the current operation
   * @type {boolean}
   */
  let status = false;

  /**
   * This is the response that is sent to client
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
     * @type {string}
     * @const
     */
    const email = req.body[BODY_CONSTANT.EMAIL];

    /**
     * This is the email passed the validateJWT middleware
     *
     * @type {string}
     * @const
     */
    const userEmailInHeader =
      req[BODY_CONSTANT.CURRENT_USER][BODY_CONSTANT.EMAIL];

    /**
     * This is the status of the validity of email passed by client in request body
     * @type {boolean}
     * @const
     */
    const isValidEmail = validateEmail(email);

    /**
     * Checking if the email from request body is not valid and if it is not same as the email passed by the validateJWT middleware
     */
    if (!isValidEmail || email !== userEmailInHeader) {
      response = {
        statusCode: 401,
        message: `${
          BODY_CONSTANT.EMAIL.charAt(0).toUpperCase() +
          BODY_CONSTANT.EMAIL.slice(1)
        }${COMMON_CONSTANT.INVALID_FIELD}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * This is the count of the documents that were deleted after querying from the database (it should be 1 in this case)
     *
     * @type {({acknowledged: string, deletedCount: number}|undefined)}
     * @const
     */
    const existingUser = await User.deleteOne({ email: userEmailInHeader });

    logger(existingUser);

    /**
     * Checking if the user doesn't exists or if the deletion was not successful, then returning an error, else also deleting all the tasks related to the same user and sending back the user document
     */
    if (!existingUser || existingUser.deletedCount === 0) {
      response = {
        statusCode: 404,
        message: `${DB_OPERATION_CONSTANT.USER_DOESNT_EXIST}`,
        status: status,
      };
      return handleError(response, res);
    } else {
      await Task.deleteMany({ email: userEmailInHeader });
      status = true;
      response = {
        statusCode: 200,
        message: DB_OPERATION_CONSTANT.DATA_DELETED,
        status: status,
      };
      return handleSuccess(response, res);
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

module.exports = { profile, deleteProfile };
