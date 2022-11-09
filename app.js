const express = require("express");
const app = express();
const cors = require("cors");
const initializeDatabase = require("./configs/connectToDatabase.js");
const routes = require("./app/routes");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(routes);

initializeDatabase.connectToDatabase();

app.listen(process.env.PORT);
