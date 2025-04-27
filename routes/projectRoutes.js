const express = require('express');
const { getProjects, createProject, updateProject, deleteProject } = require("../controllers/projectController");
const { protect, checkProjectOwnership } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.route('/').get(getProjects);
router.route('/').post(createProject);
router.route('/:id').put(checkProjectOwnership, updateProject)
router.route('/:id').delete(checkProjectOwnership, deleteProject);

module.exports = router;