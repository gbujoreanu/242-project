const express = require('express');
const router = express.Router();
const Goal = require('../models/goal');

// Route for fetching all goals
router.get('/goals', async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for adding a new goal
router.post('/goals', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const goal = new Goal({ title, description, completed });
    await goal.save();
    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for updating a goal
router.put('/goals/:id', async (req, res) => {
  try {
    const goalId = req.params.id;
    const { title, description, completed } = req.body;
    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { title, description, completed },
      { new: true }
    );
    res.json(updatedGoal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for deleting a goal
router.delete('/goals/:id', async (req, res) => {
  try {
    const goalId = req.params.id;
    await Goal.findByIdAndRemove(goalId);
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
