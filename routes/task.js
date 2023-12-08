const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Route for fetching all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for adding a new task
router.post('/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = new Task({ title, description });
    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for updating a task
router.put('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for deleting a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.findByIdAndRemove(taskId);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
