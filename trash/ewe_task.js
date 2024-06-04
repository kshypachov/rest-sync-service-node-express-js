const Task = require('./dddTask');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.findAll(); // Use findAll() to get all tasks
  res.status(200).json({ tasks });
});

const createTask = asyncWrapper(async (req, res) => {
  const { title, description } = req.body; // Destructure title and description from req.body
  const task = await Task.create({ title, description }); // Use create() to create a new task
  res.status(201).json({ task });
});

const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskId } = req.params; // Change variable name to taskId for consistency
  const task = await Task.findByPk(taskId); // Use findByPk() to find a task by primary key
  if (!task) {
    return next(createCustomError(`No task with id : ${taskId}`, 404));
  }
  res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id: taskId } = req.params;
  const task = await Task.findByPk(taskId); // Use findByPk() to find the task to delete
  if (!task) {
    return next(createCustomError(`No task with id : ${taskId}`, 404));
  }
  await task.destroy(); // Use destroy() to delete the task
  res.status(200).json({ message: 'Task deleted successfully' });
});

const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: taskId } = req.params;
  const task = await Task.findByPk(taskId); // Use findByPk() to find the task to update
  if (!task) {
    return next(createCustomError(`No task with id : ${taskId}`, 404));
  }
  await task.update(req.body); // Use update() to update the task
  res.status(200).json({ task });
});

module.exports = {
  createTask,
  getTask,
  getAllTasks,
  updateTask,
  deleteTask,
};
