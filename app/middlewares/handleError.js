const { commonConstant } = require("../../constants/constant");

/**
 * This method receives the error object and sends error to client incase of any error,
 * it defaults to default values, if no status code or message is passed
 *
 * @param {{statusCode: number, message: string, status: boolean}} error is the error object sent by the callee, it contains the status code, message and status for the current action
 * @param {{}} res is the response object sent by the callee
 * @returns {{message: string, status: boolean }} error object
 */
const handleError = (error, res) => {
  /**
   * @type {number}
   * @const
   */
  const statusCode = Number(error.statusCode) || 500;
  /**
   * @type {string}
   * @const
   */
  const message = error.message || commonConstant.GENERIC_ERROR_MESSAGE;
  /**
   * @type {boolean}
   * @const
   */
  const status = error.status || false;

  return res.status(statusCode).json({
    message: message,
    status: status,
  });
};

module.exports = { handleError };
