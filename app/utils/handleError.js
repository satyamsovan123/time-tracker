const { COMMON_CONSTANT } = require("../../constants/constant");

/**
 * This method receives the error object and sends error to client incase of any error,
 * it defaults to default values, if no status code or message is passed by the callee
 *
 * @param {{statusCode: number, message: string, status: boolean}} error is the error object sent by the callee, it contains the status code, message and status for the current action
 * @param {{}} res is the response object sent by the callee
 * @returns {{message: string, status: boolean }} error object
 */
const handleError = (error, res) => {
  /**
   * This is the HTTP status code that would be sent to client and for success, it's 200 by default
   *
   * @type {number}
   * @const
   */
  const statusCode = Number(error.statusCode) || 500;

  /**
   *
   * This is the message that would be sent to client as success response
   *
   * @type {string}
   * @const
   */
  const message = error.message || COMMON_CONSTANT.GENERIC_ERROR_MESSAGE;

  /**
   * This is the status of the action that is currently happening
   *
   * @type {boolean}
   */
  const status = error.status || false;

  /**
   * The error response body is sent to client
   */
  return res.status(statusCode).json({
    message: message,
    status: status,
  });
};

module.exports = { handleError };
