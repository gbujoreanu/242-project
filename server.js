const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB using your MongoDB Atlas connection string
mongoose.connect('mongodb+srv://gbujoreanu:YElr2L8IAB0IS1as@cluster0.iucb2kd.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import and use the routes for each data type
const calendarRoutes = require('./routes/calendar');
const taskRoutes = require('./routes/task');
const checklistRoutes = require('./routes/checklist');
const goalRoutes = require('./routes/goal');

app.use(calendarRoutes);
app.use(taskRoutes);
app.use(checklistRoutes);
app.use(goalRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
