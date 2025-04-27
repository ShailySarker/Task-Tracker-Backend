const mongoose = require('mongoose');

// Validate MongoDB ID
const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Async handler wrapper to catch errors in async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Pagination helper
const paginate = (query, options) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;

  return query.skip(skip).limit(limit);
};

// Filter helper for tasks
const filterTasks = (tasks, filters) => {
  return tasks.filter((task) => {
    let isValid = true;
    for (const key in filters) {
      if (key === 'status') {
        isValid = isValid && task[key] === filters[key];
      } else if (key === 'dueDate') {
        const taskDate = new Date(task[key]).setHours(0, 0, 0, 0);
        const filterDate = new Date(filters[key]).setHours(0, 0, 0, 0);
        isValid = isValid && taskDate === filterDate;
      } else if (key === 'search') {
        const searchRegex = new RegExp(filters[key], 'i');
        isValid =
          isValid &&
          (searchRegex.test(task.title) || searchRegex.test(task.description));
      }
    }
    return isValid;
  });
};

// Sort helper for tasks
const sortTasks = (tasks, sortBy) => {
  return [...tasks].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else {
      // Default sort by creation date
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
};

module.exports = {
  isValidId,
  asyncHandler,
  paginate,
  filterTasks,
  sortTasks,
};