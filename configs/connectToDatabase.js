const mongoose = require("mongoose");
require("dotenv").config();

const { COMMON_CONSTANT } = require("../constants/constant");

const { logger } = require("../app/utils/logger");

/**
 * This function connects to cloud MongoDB database using the database URL in environment file,
 * it logs the status after connection
 */
function connectToDatabase() {
  /**
   * This is URL fetched from environment file
   *
   * @type {string}
   * @const
   */
  const uri = process.env.DB_URL;

  /**
   * This is options object that needs to passed while connecting to MongoDB
   *
   * @type {}
   * @const
   */
  const options = { useNewUrlParser: true, useUnifiedTopology: true };

  /**
   * This is the connection function
   */
  mongoose.connect(uri, options).then(
    () => {
      console.log(process.env.NODE_ENV);
      logger(COMMON_CONSTANT.DB_CONNECTION_STATUS_OK);
    },
    (error) => {
      logger(error);
    }
  );
}

module.exports = { connectToDatabase };
