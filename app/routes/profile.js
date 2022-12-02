const express = require("express");
const router = express.Router();
const { validateJWT } = require("../middlewares/JWT");
const { getProfile, deleteProfile } = require("../controllers/profile");

router.post("/get-profile", validateJWT, getProfile);
router.post("/delete-profile", validateJWT, deleteProfile);

module.exports = router;
