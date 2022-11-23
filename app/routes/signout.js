const express = require("express");
const router = express.Router();
const { signout } = require("../controllers/signout");
const { validateJWT } = require("../middlewares/JWT");

router.get("/signout", validateJWT, signout);

module.exports = router;
