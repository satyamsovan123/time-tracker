/**
 * This method validates email using regular expression
 *
 * @param {string} email is the email received
 * @returns {boolean} true if email is valid, else it returns false
 */
const validateEmail = (email) => {
  /**
   * @type {boolean}
   */
  let isEmailValid = false;

  if (email && email.length) {
    isEmailValid = String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  return isEmailValid;
};

module.exports = { validateEmail };
