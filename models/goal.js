const mongoose = require('mongoose');

// Define the Goal schema
const goalSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  // Add other properties as needed
});

// Create the Goal model
const Goal = mongoose.model('Goal', goalSchema);

// Export the model
module.exports = Goal;
