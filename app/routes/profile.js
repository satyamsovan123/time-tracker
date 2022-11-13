const express = require("express");
const router = express.Router();
const { validateJWT } = require("../middlewares/JWT");
const { profile, deleteProfile } = require("../controllers/profile");

router.post("/profile", validateJWT, profile);
router.delete("/profile", validateJWT, deleteProfile);

module.exports = router;
