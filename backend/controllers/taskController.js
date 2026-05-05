const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const Project = require("../models/Project");

exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, project, assignedTo, status, dueDate } = req.body;
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      status: status || "Todo",
      dueDate,
    });
    return res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { project, status, assignedTo, page = 1, limit = 10, search = "" } = req.query;
    const query = {};
    if (project) query.project = project;
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (req.user.role !== "Admin") {
      query.assignedTo = req.user._id;
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate("project", "title")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Task.countDocuments(query),
    ]);

    return res.json({
      data: tasks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAdmin = req.user.role === "Admin";
    const isAssignee = task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!isAdmin) {
      task.status = req.body.status || task.status;
      await task.save();
      return res.json(task);
    }

    const allowed = ["title", "description", "project", "assignedTo", "status", "dueDate"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });
    await task.save();
    return res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    return res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
