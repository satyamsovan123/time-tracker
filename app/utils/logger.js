require("dotenv").config();

const { commonConstant } = require("../../constants/constant");

/**
 * This method prints the data provided in the console, if the environment is not production
 * @param {*} data is the data to be printed on the console
 */
const logger = (data) => {
  if (process.env.ENV !== commonConstant.PROD_ENV) console.log(data);
};

module.exports = { logger };
