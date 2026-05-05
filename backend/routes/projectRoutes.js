const express = require("express");
const { body } = require("express-validator");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
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
      body("members").optional().isArray(),
    ],
    createProject
  )
  .get(getProjects);

router.route("/:id").get(getProjectById).put(roleMiddleware("Admin"), updateProject).delete(roleMiddleware("Admin"), deleteProject);

module.exports = router;
