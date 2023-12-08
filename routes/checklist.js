const express = require('express');
const router = express.Router();
const ChecklistItem = require('../models/checklistItem');

// Route for fetching all checklist items
router.get('/checklist-items', async (req, res) => {
  try {
    const checklistItems = await ChecklistItem.find();
    res.json(checklistItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for adding a new checklist item
router.post('/checklist-items', async (req, res) => {
  try {
    const { text, completed } = req.body;
    const item = new ChecklistItem({ text, completed });
    await item.save();
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for updating a checklist item
router.put('/checklist-items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const { text, completed } = req.body;
    const updatedItem = await ChecklistItem.findByIdAndUpdate(
      itemId,
      { text, completed },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for deleting a checklist item
router.delete('/checklist-items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    await ChecklistItem.findByIdAndRemove(itemId);
    res.json({ message: 'Checklist item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
