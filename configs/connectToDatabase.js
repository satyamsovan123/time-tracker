const mongoose = require("mongoose");
const { commonConstant } = require("../constants/constant");
require("dotenv").config();
const { logger } = require("../app/utils/logger");

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
