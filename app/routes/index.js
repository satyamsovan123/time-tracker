const express = require("express");
const { COMMON_CONSTANT } = require("../../constants/constant");
const { handleSuccess, handleError } = require("../utils");
const router = express.Router();
const baseURL = "/api/";

router.use(baseURL, require("./profile"));
router.use(baseURL, require("./signup"));
router.use(baseURL, require("./signin"));
router.use(baseURL, require("./task"));
router.use(baseURL, require("./insight"));

router.get("/", (req, res) => {
  response = {
    statusCode: 200,
    message: `${COMMON_CONSTANT.API_STATUS_OK}`,
    status: true,
  };
  return handleSuccess(response, res);
});

router.use("*", (req, res) => {
  response = {
    statusCode: 500,
    message: `${COMMON_CONSTANT.INVALID_PATH}`,
    status: false,
  };
  return handleError(response, res);
});

module.exports = router;
