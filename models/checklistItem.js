const mongoose = require('mongoose');

// Define the ChecklistItem schema
const checklistItemSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  // Add other properties as needed
});

// Create the ChecklistItem model
const ChecklistItem = mongoose.model('ChecklistItem', checklistItemSchema);

// Export the model
module.exports = ChecklistItem;
