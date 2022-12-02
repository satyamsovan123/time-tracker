const {
  COMMON_CONSTANT,
  BODY_CONSTANT,
} = require("../../../constants/constant");

const { handleError, handleSuccess, logger } = require("../../utils");

/**
 * This method signs out the user, by deleting the cookie
 * It sends the request to browser to delete the associated cookie
 *
 * @requires {@link handleError}
 * @requires {@link handleSuccess}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @returns {{message: string, status: boolean}} success response (with JWT as cookies) or error response object based on various criterias
 */
const signout = async (req, res) => {
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
     * Instead of clearing cookie, manually setting the cookie to hold empty string "" and setting expiry time to past
     */
    // res.clearCookie(BODY_CONSTANT.ACCESS_TOKEN);
    res.cookie(BODY_CONSTANT["ACCESS_TOKEN"], "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: new Date(null),
    });
    response = {
      statusCode: 200,
      message: COMMON_CONSTANT.SIGNOUT_SUCCESSFUL,
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

module.exports = { signout };
