const { verifyToken } = require("../config/jwt");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = verifyToken(token);

            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
};

const checkProjectOwnership = async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    if (project.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this project');
    }

    next();
};

const checkTaskOwnership = async (req, res, next) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    if (task.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this task');
    }

    next();
};

module.exports = { protect, checkProjectOwnership, checkTaskOwnership };