/**
 * This method validates alphanumeric string using regular expression
 *
 * @param {string} data is the data received
 * @returns {boolean} true if data is alphanumeric, else it returns false
 */
const validateAlphaNumericString = (data) => {
  /**
   * This is the status of the verification of the email
   *
   * @type {boolean}
   */
  let status = false;

  /**
   * Checking if data has a valid length and then matching the email with alphnumeric pattern, else returning an error response
   */
  if (data && data.length) {
    status = String(data).match(/^\w+$/);
  }

  return status;
};

module.exports = { validateAlphaNumericString };
