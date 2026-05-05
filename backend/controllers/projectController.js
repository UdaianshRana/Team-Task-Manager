const { validationResult } = require("express-validator");
const Project = require("../models/Project");
const Task = require("../models/Task");

exports.createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, members = [] } = req.body;
    const uniqueMembers = [...new Set([...members, req.user._id.toString()])];
    const project = await Project.create({
      title,
      description,
      members: uniqueMembers,
      createdBy: req.user._id,
    });
    return res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const query =
      req.user.role === "Admin"
        ? {}
        : {
            members: req.user._id,
          };
    const projects = await Project.find(query)
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });
    return res.json(projects);
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const isMember =
      req.user.role === "Admin" ||
      project.members.some((member) => member._id.equals(req.user._id));
    if (!isMember) {
      return res.status(403).json({ message: "Access denied to this project" });
    }
    return res.json(project);
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { title, description, members = [] } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.title = title ?? project.title;
    project.description = description ?? project.description;
    if (members.length) {
      project.members = [...new Set([...members, project.createdBy.toString()])];
    }
    await project.save();
    return res.json(project);
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    return res.json({ message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};
