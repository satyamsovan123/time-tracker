const { Task, User, Insight } = require("../../models");

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
 * This method returns the insights for the requested authenticated user
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
const getInsight = async (req, res) => {
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
     * These are the insight documents that is fetched after querying from the database
     *
     * @type {({_id: ObjectId, email: string, dateAdded: Date, totalTimeLogged: string, timeUsed: string, percentageUsed: string, comment: string}|null)}
     * @const
     */
    const userInsights = await Insight.find({
      email: userEmailInHeader,
    }).select("-_id");

    logger(userInsights);

    status = true;
    response = {
      data: userInsights,
      statusCode: 200,
      message: DB_OPERATION_CONSTANT.DATA_RETRIEVED,
      status: status,
    };
    return handleSuccess(response, res);
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
 * This method deletes the insight requested by the client for a authenticated user
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
const deleteInsight = async (req, res) => {
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
     * This is the dateAdded property passed by the client in request body
     *
     * @type {string}
     * @const
     */
    const dateAdded = req.body[BODY_CONSTANT.DATE_ADDED];

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
     * Checking if the dateAdded property from the request body is not valid
     */
    if (!dateAdded) {
      response = {
        statusCode: 401,
        message: `${COMMON_CONSTANT.REQUIRED_FIELD_BLANK}`,
        status: status,
      };
      return handleError(response, res);
    }

    /**
     * Deleting the required insight document by searching by the date added and email
     */
    const deletedInsight = await Insight.deleteOne({
      email: userEmailInHeader,
      dateAdded: dateAdded,
    });

    logger(deletedInsight);

    /**
     * Checking if no data was deleted, then returning no data found in database
     */
    if (!deletedInsight || deletedInsight.deletedCount === 0) {
      response = {
        statusCode: 404,
        message: DB_OPERATION_CONSTANT.UNABLE_TO_RETRIEVE_DATA,
        status: status,
      };
      return handleSuccess(response, res);
    }

    status = true;
    response = {
      statusCode: 200,
      message: DB_OPERATION_CONSTANT.DATA_DELETED,
      status: status,
    };
    return handleSuccess(response, res);
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

module.exports = { deleteInsight, getInsight };
