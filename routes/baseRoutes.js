const express = require('express');
const router = express.Router();

// Import all the route files
const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const taskRoutes = require('./taskRoutes');



// Define the routes under their respective paths
router.use('/api/auth', authRoutes);
router.use('/api/projects', projectRoutes);
router.use('/api/tasks', taskRoutes);


module.exports = router;