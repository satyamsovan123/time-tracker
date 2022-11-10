const express = require("express");
const router = express.Router();
const { profile, deleteProfile } = require("../controllers/profile");
const { validateJWT } = require("../middlewares/JWT");

router.post("/profile", validateJWT, profile);
router.delete("/profile", validateJWT, deleteProfile);

module.exports = router;
