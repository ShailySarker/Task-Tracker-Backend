const Project = require("../models/projectModel");
const Task = require("../models/taskModel");


// ########### Get Task ##########
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId });
  res.json(tasks);
};

// ########### Create Task ##########
exports.createTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const task = new Task({
    title,
    description,
    status,
    dueDate,
    project: project._id,
    user: req.user._id,
  });

  const createdTask = await task.save();
  
  // Add task to project
  project.tasks.push(createdTask._id);
  await project.save();

  res.status(201).json(createdTask);
};

// ########### Update Task ##########
exports.updateTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    if (status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    } else if (status !== 'completed') {
      task.completedAt = null;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

// ########### Delete Task ##########
exports.deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    // Remove task from project
    await Project.updateOne(
      { _id: task.project },
      { $pull: { tasks: task._id } }
    );

    await task.remove();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};