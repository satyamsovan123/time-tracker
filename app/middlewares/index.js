const { validateJWT } = require("./validateJWT");
const { validateEmail } = require("./validateEmail");
const { validateRequestBody } = require("./validateRequestBody");
const { handleError } = require("./handleError");

module.exports = {
  validateJWT,
  validateEmail,
  validateRequestBody,
  handleError,
};
