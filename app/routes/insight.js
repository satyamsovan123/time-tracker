const express = require("express");
const router = express.Router();
const { validateJWT } = require("../middlewares/JWT");
const { getInsight, deleteInsight } = require("../controllers/insight");

router.post("/get-insight", validateJWT, getInsight);
router.post("/delete-insight", validateJWT, deleteInsight);

module.exports = router;
