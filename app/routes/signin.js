const express = require("express");
const router = express.Router();
const { signin } = require("../controllers/signin");
const { validateRequestBody } = require("../middlewares/validateRequestBody");

router.post("/signin", validateRequestBody, signin);

module.exports = router;
