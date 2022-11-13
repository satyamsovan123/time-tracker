const express = require("express");
const { COMMON_CONSTANT } = require("../../constants/constant");
const router = express.Router();
const baseURL = "/api/";

router.use(baseURL, require("./profile"));
router.use(baseURL, require("./signup"));
router.use(baseURL, require("./signin"));
router.use(baseURL, require("./task"));
router.use(baseURL, require("./insight"));

router.get("/", (req, res) => {
  res.status(200).json({ message: COMMON_CONSTANT.API_STATUS_OK });
});

router.use("*", (req, res) => {
  res.status(404).json({ message: COMMON_CONSTANT.INVALID_PATH });
});

module.exports = router;
