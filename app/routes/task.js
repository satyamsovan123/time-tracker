const express = require("express");
const router = express.Router();
const { validateJWT } = require("../middlewares/JWT");
const { currentTask, updateTask } = require("../controllers/task");

router.post("/task", validateJWT, currentTask);
router.put("/task", validateJWT, updateTask);

module.exports = router;
