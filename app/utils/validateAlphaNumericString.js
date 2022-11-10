/**
 * This method validates alphanumeric string using regular expression
 *
 * @param {string} data is the data received
 * @returns {boolean} true if data is alphanumeric, else it returns false
 */
const validateAlphaNumericString = (data) => {
  /**
   * @type {boolean}
   */
  let isStringAlphaNumeric = false;

  if (data && data.length) {
    isStringAlphaNumeric = String(data).match(/^\w+$/);
  }

  return isStringAlphaNumeric;
};

module.exports = { validateAlphaNumericString };
