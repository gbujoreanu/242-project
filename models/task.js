const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  // Add other properties as needed
});

// Create the Task model
const Task = mongoose.model('Task', taskSchema);

// Export the model
module.exports = Task;
