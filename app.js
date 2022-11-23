const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const initializeDatabase = require("./configs/connectToDatabase.js");
const routes = require("./app/routes");
const { validateRequestJSON } = require("./app/utils/validateRequestJSON.js");

// app.use(cors());
// app.use(
//   cors({
//     origin: process.env.FRONTEND_PRODUCTION_URL,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// origin: process.env.NODE_ENV === process.env.FRONTEND_PRODUCTION_URL
//   ? process.env.FRONTEND_PRODUCTION_URL
//   : process.env.FRONTEND_DEVELOPMENT_URL,

app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === process.env.FRONTEND_PRODUCTION_URL
      ? process.env.FRONTEND_PRODUCTION_URL
      : process.env.FRONTEND_DEVELOPMENT_URL
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(validateRequestJSON);
app.use(routes);

/**
 * Initializing the database
 */
initializeDatabase.connectToDatabase();

/**
 * Starting the application using a port
 */
app.listen(process.env.PORT || 3000);
