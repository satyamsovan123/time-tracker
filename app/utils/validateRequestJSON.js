const { COMMON_CONSTANT } = require("../../constants/constant");

const { handleError } = require("./handleError");
const { logger } = require("./logger");

/**
 *  This middleware function checks the request JSON and returns error, if the JSON is formatted incorrectly
 *  (even though it's middleware, it's still placed here 🤷)
 *
 * @async This function is asynchronous
 * @param {{}} err is the error object
 * @param {{}} req is the request body that is received by server
 * @param {{}} res is the response body that will be sent to client
 * @param {{}} next is the middleware that is called later on successful validation of request JSON
 * @returns {{}} the control to the next middleware by calling the {@link next()} function, else it returns error if a the request JSON is not valid
 */
const validateRequestJSON = (err, req, res, next) => {
  /**
   * Checking if the (JSON is valid or not) the error is related to SyntaxError and there is 'body' in the message of the error, it that's the case then returning an error, else passing the control to next middleware
   */
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    logger(err);
    const response = {
      statusCode: 400,
      message: COMMON_CONSTANT.INVALID_BODY,
    };
    return handleError(response, res);
  }
  return next();
};

module.exports = { validateRequestJSON };
