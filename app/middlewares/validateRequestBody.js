const { commonConstant } = require("../../constants/constant");
const { logger, handleError } = require("../utils");

/**
 * This method checks if the keys in the body are empty
 * @param {{}} body is the request body
 * @returns {boolean} false if one of the keys in the request body is empty, else it returns true
 */

/**
 * This middleware function checks if the keys in the body are empty
 *
 * @requires {@link handleError}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @returns {{}} calls the {@link next()} function to complete the chain
 */
const validateRequestBody = async (req, res, next) => {
  /**
   * @type {boolean}
   */
  let isValidRequestBody = true;
  /**
   * @type {{statusCode: number, message: string}}
   */
  let error = {
    stausCode: 500,
    message: commonConstant.GENERIC_ERROR_MESSAGE,
  };
  try {
    /**
     * @type {[]}
     */
    const bodyKeys = Object.keys(req.body);

    if (bodyKeys.length) {
      bodyKeys.forEach((key) => {
        const currentKeyValue = req.body[key];
        if (currentKeyValue) {
          isValidRequestBody = isValidRequestBody && true;
        } else {
          isValidRequestBody = isValidRequestBody && false;
        }
      });
    } else {
      isValidRequestBody = false;
    }
    if (isValidRequestBody) return next();
    error = {
      statusCode: 400,
      message: commonConstant.INVALID_BODY,
      status: isValidRequestBody,
    };
    logger(error);
    return handleError(error, res);
  } catch (error) {
    isValidRequestBody = false;
    error = {
      statusCode: 500,
      message: commonConstant.GENERIC_ERROR_MESSAGE,
      status: isValidRequestBody,
    };
    logger(error);
    return handleError(error, res);
  }
};

module.exports = { validateRequestBody };
