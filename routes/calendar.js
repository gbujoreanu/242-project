const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/calendarevent');

// Route for fetching all calendar events
router.get('/calendar-events', async (req, res) => {
  try {
    const calendarEvents = await CalendarEvent.find();
    res.json(calendarEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for adding a new calendar event
router.post('/calendar-events', async (req, res) => {
  try {
    const { title, date } = req.body;
    const event = new CalendarEvent({ title, date });
    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for updating a calendar event
router.put('/calendar-events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, date } = req.body;
    const updatedEvent = await CalendarEvent.findByIdAndUpdate(
      eventId,
      { title, date },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for deleting a calendar event
router.delete('/calendar-events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    await CalendarEvent.findByIdAndRemove(eventId);
    res.json({ message: 'Calendar event deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
