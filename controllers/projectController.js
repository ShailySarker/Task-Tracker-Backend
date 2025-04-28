const Project = require("../models/projectModel");

// ############ Get Project #############
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id }).populate('tasks');
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

// ############ Create Project #############
exports.createProject = async (req, res, next) => {
    const { name, description } = req.body;

    try {
        const project = new Project({
            name,
            description,
            user: req.user._id,
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        next(error);
    }
};

// ############ Update Project #############
exports.updateProject = async (req, res, next) => {
    const { name, description } = req.body;

    try {
        console.log('Updating project with ID:', req.params.id); // Debug log

        const project = await Project.findById(req.params.id);

        if (!project) {
            throw new APIError('Project not found', 404);
        }

        project.name = name || project.name;
        project.description = description || project.description;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        next(error);
    }
};

// ############ Delete Project #############
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            throw new APIError('Project not found', 404);
        }

        res.json({ message: 'Project removed' });
    } catch (error) {
        next(error);
    }
};