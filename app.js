const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT);
