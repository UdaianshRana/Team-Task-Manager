const express = require("express");
const { body } = require("express-validator");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .post(
    roleMiddleware("Admin"),
    [
      body("title").trim().notEmpty().withMessage("Title is required"),
      body("project").notEmpty().withMessage("Project is required"),
      body("assignedTo").notEmpty().withMessage("Assignee is required"),
      body("dueDate").notEmpty().withMessage("Due date is required"),
    ],
    createTask
  )
  .get(getTasks);

router.route("/:id").put(updateTask).delete(roleMiddleware("Admin"), deleteTask);

module.exports = router;
