/**
 * This method checks if the keys in the body are empty
 * @param {{}} body is the request body
 * @returns {boolean} false if one of the keys in the request body is empty, else it returns true
 */
const validateRequestBody = (body) => {
  /**
   * @type {boolean}
   */
  let isValidRequestBody = true;

  /**
   * @type {[]}
   */
  const bodyKeys = Object.keys(body);

  if (bodyKeys.length) {
    bodyKeys.forEach((key) => {
      const currentKeyValue = body[key];
      if (currentKeyValue) {
        isValidRequestBody = isValidRequestBody && true;
      } else {
        isValidRequestBody = isValidRequestBody && false;
      }
    });
  } else {
    isValidRequestBody = false;
  }

  return isValidRequestBody;
};

module.exports = { validateRequestBody };
