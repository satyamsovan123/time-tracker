const express = require("express");
const router = express.Router();
const { currentTask, updateTask } = require("../controllers/task");
const { validateJWT } = require("../middlewares/JWT");

router.get("/task", validateJWT, currentTask);
router.put("/task", validateJWT, updateTask);

module.exports = router;
