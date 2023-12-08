const mongoose = require('mongoose');

// Define the CalendarEvent schema
const calendarEventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  // Add other properties as needed
});

// Create the CalendarEvent model
const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

// Export the model
module.exports = CalendarEvent;
