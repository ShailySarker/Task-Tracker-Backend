const express = require('express');
const { protect, checkProjectOwnership, checkTaskOwnership } = require('../middlewares/auth');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const router = express.Router();

router.use(protect);

router.route('/projects/:projectId/tasks').get(checkProjectOwnership, getTasks);
router.route('/projects/:projectId/tasks').post(checkProjectOwnership, createTask);
router.route('/:id').put(checkTaskOwnership, updateTask);
router.route('/:id').delete(checkTaskOwnership, deleteTask);


module.exports = router;