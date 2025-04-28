const Project = require("../models/projectModel");
const Task = require("../models/taskModel");


// ########### Get Task ##########
exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ project: req.params.id });
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

// ########### Create Task ##########
exports.createTask = async (req, res, next) => {
    const { title, description, status, dueDate } = req.body;

    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            throw new APIError('Project not found', 404);
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

        project.tasks.push(createdTask._id);
        await project.save();

        res.status(201).json(createdTask);
    } catch (error) {
        next(error);
    }
};

// ########### Update Task ##########
exports.updateTask = async (req, res, next) => {
    const { title, description, status, dueDate } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            throw new APIError('Task not found', 404);
        }

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
    } catch (error) {
        next(error);
    }
};

// ########### Delete Task ##########
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            throw new APIError('Task not found', 404);
        }

        await Project.updateOne(
            { _id: task.project },
            { $pull: { tasks: task._id } }
        );

        // await task.remove();
        res.json({ message: 'Task removed' });
    } catch (error) {
        next(error);
    }
};