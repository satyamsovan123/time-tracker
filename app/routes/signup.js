const express = require("express");
const router = express.Router();
const { validateRequestBody } = require("../middlewares/validateRequestBody");
const { signup } = require("../controllers/signup");

router.post("/signup", validateRequestBody, signup);

module.exports = router;
