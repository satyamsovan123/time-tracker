const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const initializeDatabase = require("./configs/connectToDatabase.js");
const routes = require("./app/routes");
const { validateRequestJSON } = require("./app/utils/validateRequestJSON.js");

// app.use(cors());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
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
