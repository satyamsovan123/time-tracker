const mongoose = require("mongoose");
require("dotenv").config();

const { commonConstant } = require("../constants/constant");

const { logger } = require("../app/utils/logger");

/**
 * This function connects to cloud MongoDB database using the database URL in environment file,
 * it logs the status after connection
 */
function connectToDatabase() {
  const uri = process.env.DB_URL;
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.connect(uri, options).then(
    () => {
      logger(commonConstant.DB_CONNECTION_STATUS_OK);
    },
    (error) => {
      logger(error);
    }
  );
}

module.exports = { connectToDatabase };
