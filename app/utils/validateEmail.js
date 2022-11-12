/**
 * This method validates email using regular expression
 *
 * @param {string} email is the email received
 * @returns {boolean} true if email is valid, else it returns false
 */
const validateEmail = (email) => {
  /**
   * This is the status of the verification of the email
   *
   * @type {boolean}
   */
  let status = false;

  /**
   * Checking if email has a valid length and then matching the email with pattern, else returning an error response
   */
  if (email && email.length) {
    status = String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  return status;
};

module.exports = { validateEmail };
