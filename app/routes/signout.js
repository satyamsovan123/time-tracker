const express = require("express");
const router = express.Router();
const { signout } = require("../controllers/signout");
const { validateJWT } = require("../middlewares/JWT");

router.post("/signout", validateJWT, signout);

module.exports = router;
