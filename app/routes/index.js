const express = require("express");
const { COMMON_CONSTANT, BODY_CONSTANT } = require("../../constants/constant");
const { handleSuccess, handleError } = require("../utils");
const router = express.Router();
const baseURL = "/api/";

router.use(baseURL, require("./profile"));
router.use(baseURL, require("./signup"));
router.use(baseURL, require("./signin"));
router.use(baseURL, require("./signout"));
router.use(baseURL, require("./task"));
router.use(baseURL, require("./insight"));

/**
 * This middleware function is handling the base route for it's used for quick testing and welcome
 */
router.get("/", (req, res) => {
  console.log(req.cookies[BODY_CONSTANT.TIME_TRACKER_TOKEN]);

  /**
   * This is the response that is sent to client
   *
   * @type {{statusCode: number, message: string, status: status}}
   * @const
   *
   */
  const response = {
    statusCode: 200,
    message: `${COMMON_CONSTANT.API_STATUS_OK}`,
    status: true,
  };
  return handleSuccess(response, res);
});

/**
 * This middleware function is handling the error routes and the invalid routes
 */
router.use("*", (req, res) => {
  /**
   * This is the response that is sent to client
   *
   * @type {{statusCode: number, message: string, status: status}}
   * @const
   *
   */
  const response = {
    statusCode: 400,
    message: `${COMMON_CONSTANT.INVALID_PATH}`,
    status: false,
  };
  return handleError(response, res);
});

module.exports = router;
