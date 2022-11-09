const express = require("express");
const router = express.Router();
const { profile, deleteProfile } = require("../controllers/profile");

router.get("/profile", profile);
router.delete("/profile", deleteProfile);

module.exports = router;
