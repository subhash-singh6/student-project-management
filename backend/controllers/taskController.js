const Task = require("../models/Task");
const Project = require("../models/Project");

const canAccessProject = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) return { ok: false, status: 404, message: "Project not found." };

  if (user.role === "teacher") return { ok: true, project };
  if (user.role === "mentor" && project.mentor?.toString() === user._id.toString()) {
    return { ok: true, project };
  }
  if (user.role === "student" && project.createdBy.toString() === user._id.toString()) {
    return { ok: true, project };
  }
  return { ok: false, status: 403, message: "Access denied." };
};

const getTasksByProject = async (req, res) => {
  try {
    const access = await canAccessProject(req.params.projectId, req.user);
    if (!access.ok) return res.status(access.status).json({ message: access.message });

    const tasks = await Task.find({ project: req.params.projectId }).sort({ order: 1, createdAt: 1 });

    const grouped = { todo: [], inprogress: [], review: [], done: [] };
    tasks.forEach((t) => {
      const col = grouped[t.column] ? t.column : "todo";
      grouped[col].push(t);
    });

    res.status(200).json({ success: true, tasks: grouped, all: tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { projectId, title, priority, assignee, column } = req.body;
    const access = await canAccessProject(projectId, req.user);
    if (!access.ok) return res.status(access.status).json({ message: access.message });

    const count = await Task.countDocuments({ project: projectId, column: column || "todo" });
    const task = await Task.create({
      project: projectId,
      createdBy: req.user._id,
      title,
      priority: priority || "medium",
      assignee: assignee || "",
      column: column || "todo",
      order: count,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const access = await canAccessProject(task.project.toString(), req.user);
    if (!access.ok) return res.status(access.status).json({ message: access.message });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, task: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const access = await canAccessProject(task.project.toString(), req.user);
    if (!access.ok) return res.status(access.status).json({ message: access.message });

    await task.deleteOne();
    res.status(200).json({ success: true, message: "Task deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const moveTask = async (req, res) => {
  try {
    const { column, order } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const access = await canAccessProject(task.project.toString(), req.user);
    if (!access.ok) return res.status(access.status).json({ message: access.message });

    task.column = column || task.column;
    if (order !== undefined) task.order = order;
    await task.save();

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasksByProject, createTask, updateTask, deleteTask, moveTask };
