const { COMMON_CONSTANT, BODY_CONSTANT } = require("../../constants/constant");

/**
 * This method receives the success object and sends success object to client,
 * it defaults to default values, if no status code or message is passed by the callee
 *
 * @param {{data: ({}|null), statusCode: number, message: string, status: boolean}} success is the success object sent by the callee, it contains the status code, message and status for the current action
 * @param {{}} res is the response object sent by the callee
 * @param {(string|undefined)} token is the JWT token and it is optional
 * @returns {{message: string, status: boolean }} success object
 */
const handleSuccess = (success, res, token) => {
  /**
   * This is the HTTP status code that would be sent to client and for success, it's 200 by default
   *
   * @type {number}
   * @const
   */
  const statusCode = Number(success.statusCode) || 200;

  /**
   *
   * This is the message that would be sent to client as success response
   *
   * @type {string}
   * @const
   */
  const message = success.message || COMMON_CONSTANT.GENERIC_SUCCESS_MESSAGE;

  /**
   * This is the status of the verification of the email
   *
   * @type {boolean}
   */
  const status = success.status || true;

  /**
   * This is the data that would be sent to client as success response
   *
   * @type {({}|null)}
   * @const
   */
  const data = success.data || null;

  /**
   * Checking if the token is sent by the callee (for /singup and /signin), then token is sent as cookie to client along with the sucess response body, else only response body is sent
   */
  if (token) {
    return res
      .cookie(BODY_CONSTANT["TIME_TRACKER_TOKEN"], token)
      .status(statusCode)
      .json({
        data: data,
        message: message,
        status: status,
      });
  }

  return res.status(statusCode).json({
    data: data,
    message: message,
    status: status,
  });
};

module.exports = { handleSuccess };
