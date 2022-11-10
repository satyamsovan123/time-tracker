const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/signup");
const { validateRequestBody } = require("../middlewares/validateRequestBody");

router.post("/signup", validateRequestBody, signup);

module.exports = router;
