const mongoose = require("mongoose");
const { commonConstant } = require("../constants/constant");
require("dotenv").config();

function connectToDatabase() {
  const uri = process.env.DB_URL;
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.connect(uri, options).then(
    () => {
      console.log(commonConstant.DB_CONNECTION_STATUS_OK);
    },
    (error) => {
      console.log(error);
    }
  );
}

module.exports = { connectToDatabase };
