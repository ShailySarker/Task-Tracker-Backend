const Project = require("../models/projectModel");

// ############ Get Project #############
exports.getProjects = async (req, res) => {
  const projects = await Project.find({ user: req.user._id }).populate('tasks');
  res.json(projects);
};

// ############ Create Project #############
exports.createProject = async (req, res) => {
  const { name, description } = req.body;

  const project = new Project({
    name,
    description,
    user: req.user._id,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

// ############ Update Project #############
exports.updateProject = async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    project.name = name || project.name;
    project.description = description || project.description;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

// ############ Delete Project #############
exports.deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.remove();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};