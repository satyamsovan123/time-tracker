require("dotenv").config();

const { COMMON_CONSTANT } = require("../../constants/constant");

/**
 * This method prints the data provided in the console, if the environment is not production
 * @param {*} data is the data to be printed on the console
 */
const logger = (data) => {
  if (process.env.NODE_ENV !== COMMON_CONSTANT.PROD_ENV) console.log(data);
};

module.exports = { logger };
