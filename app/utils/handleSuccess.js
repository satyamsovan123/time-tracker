const { commonConstant, bodyConstant } = require("../../constants/constant");

/**
 * This method receives the success object and sends success object to client,
 * it defaults to default values, if no status code or message is passed
 *
 * @param {{data: ({}|null), statusCode: number, message: string, status: boolean}} success is the success object sent by the callee, it contains the status code, message and status for the current action
 * @param {{}} res is the response object sent by the callee
 * @param {(string|undefined)} token is the JWT token and it is optional
 * @returns {{message: string, status: boolean }} success object
 */
const handleSuccess = (success, res, token) => {
  /**
   * @type {number}
   * @const
   */
  const statusCode = Number(success.statusCode) || 200;
  /**
   * @type {string}
   * @const
   */
  const message = success.message || commonConstant.GENERIC_SUCCESS_MESSAGE;
  /**
   * @type {boolean}
   * @const
   */
  const status = success.status || true;
  /**
   * @type {({}|null)}
   * @const
   */
  const data = success.data || null;

  if (token) {
    return res
      .cookie(bodyConstant["TIME_TRACKER_TOKEN"], token)
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
