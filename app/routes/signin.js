const express = require("express");
const router = express.Router();
const { validateRequestBody } = require("../middlewares/validateRequestBody");
const { signin } = require("../controllers/signin");

router.post("/signin", validateRequestBody, signin);

module.exports = router;
