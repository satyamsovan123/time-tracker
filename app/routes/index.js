const express = require("express");
const { commonConstant } = require("../../constants/constant");
const app = express();
const router = express.Router();
const baseURL = "/api/";

router.use(baseURL, require("./profile"));
router.use(baseURL, require("./signup"));
router.use(baseURL, require("./signin"));
router.use(baseURL, require("./task"));

router.get("/", (req, res) => {
  res.status(200).json({ message: commonConstant.API_STATUS_OK });
});

router.use("*", (req, res) => {
  res.status(404).json({ message: commonConstant.INVALID_PATH });
});

module.exports = router;
