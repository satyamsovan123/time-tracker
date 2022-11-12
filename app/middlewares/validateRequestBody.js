const { COMMON_CONSTANT } = require("../../constants/constant");

const { logger, handleError } = require("../utils");

/**
 * This middleware function checks if the keys in the body are not empty
 *
 * @requires {@link handleError}
 * @requires {@link logger}
 *
 * @async This function is asynchronous
 * @param {{}} req is the request body object that is received by server
 * @param {{}} res is the response body object that will be sent to client
 * @param {{}} next is the middleware that is called later on successful verification
 * @returns {{}} calls the {@link next()} function to complete the chain
 */
const validateRequestBody = async (req, res, next) => {
  /**
   * This is the status of the current operation
   *
   * @type {boolean}
   */
  let status = true;

  /**
   * This is the response that is sent to client
   *
   * @type {{statusCode: number, message: string, status: status}}
   */
  let response = {
    stausCode: 500,
    message: COMMON_CONSTANT.GENERIC_ERROR_MESSAGE,
  };

  /**
   * To avoid any errors, the entire code is placed in try catch block
   */
  try {
    /**
     * This is the array made of all the keys in the request body sent by client
     *
     * @type {[]}
     */
    const bodyKeys = Object.keys(req.body);

    /**
     * Checking if the total keys sent is not 0 and then looping each key, else returning an error
     */
    if (bodyKeys.length !== 0) {
      /**
       * Looping over each key to check if the key's value has a valid length
       */
      bodyKeys.forEach((key) => {
        const currentKeyValue = req.body[key];
        if (currentKeyValue) {
          status = status && true;
        } else {
          status = status && false;
        }
      });
    } else {
      status = false;
    }

    /**
     * Checking if above validation is successsful, then returning next() (calling next middleware)
     */
    if (status) return next();

    response = {
      statusCode: 400,
      message: COMMON_CONSTANT.INVALID_BODY,
      status: status,
    };
    logger(response);
    return handleError(response, res);
  } catch (response) {
    /**
     * Incase of any errors in the try block, a generic error message is returned to the user and error is logged to the console
     */
    status = false;
    response = {
      statusCode: 500,
      message: COMMON_CONSTANT.GENERIC_ERROR_MESSAGE,
      status: status,
    };
    logger(response);
    return handleError(response, res);
  }
};

module.exports = { validateRequestBody };
