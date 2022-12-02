const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();

const initializeDatabase = require("./configs/connectToDatabase.js");
const routes = require("./app/routes");
const { validateRequestJSON } = require("./app/utils/validateRequestJSON.js");
const { COMMON_CONSTANT } = require("./constants/constant.js");

/**
 * This is the frontend URL that is decided based on the environment for the NodeJS application, and this is used to whitelist the URL for accessing this backend application
 *
 * @type {string}
 * @const
 */
const originForCORS =
  process.env.NODE_ENV === COMMON_CONSTANT.PROD_ENV
    ? process.env.FRONTEND_PRODUCTION_URL
    : process.env.FRONTEND_DEVELOPMENT_URL;

app.use(cookieParser());

app.use(
  cors({
    origin: originForCORS,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["access_token"],
  })
);

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
