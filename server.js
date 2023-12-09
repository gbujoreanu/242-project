const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

mongoose
    .connect("mongodb+srv://gbujoreanu:YElr2L8IAB0IS1as@cluster0.iucb2kd.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Couldn't connect to MongoDB", error));

// Define Mongoose Schemas and Models for each app
const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    due_date: Date,
    priority: String,
    status: String
});

const Task = mongoose.model("Task", taskSchema);


const checklistSchema = new mongoose.Schema({
    name: String,
    items: [{ item: String, completed: Boolean }]
});

const Checklist = mongoose.model("Checklist", checklistSchema);


const goalSchema = new mongoose.Schema({
    name: String,
    description: String,
    due_date: Date,
    progress: Number,
    notes: String
});

const Goal = mongoose.model("Goal", goalSchema);


const eventSchema = new mongoose.Schema({
    date: Date,
    time: String,
    description: String
});

const Event = mongoose.model("Event", eventSchema);


// Task Endpoints
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(tasks);
    } catch (error) {
        res.status(500).send("Error retrieving tasks: " + error.message);
    }
});

app.post("/api/tasks", async (req, res) => {
    try {
        const newTask = new Task({
            name: req.body.name,
            description: req.body.description,
            due_date: req.body.due_date,
            priority: req.body.priority,
            status: req.body.status
        });
        const savedTask = await newTask.save();
        res.status(201).send(savedTask);
    } catch (error) {
        res.status(500).send("Error creating task: " + error.message);
    }
});

app.put("/api/tasks/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                due_date: req.body.due_date,
                priority: req.body.priority,
                status: req.body.status
            },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).send("Task not found.");
        }
        res.send(updatedTask);
    } catch (error) {
        res.status(500).send("Error updating task: " + error.message);
    }
});

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).send("Task not found.");
        }
        res.send(deletedTask);
    } catch (error) {
        res.status(500).send("Error deleting task: " + error.message);
    }
});

// Checklist Endpoints
app.get("/api/checklists", async (req, res) => {
    try {
        const checklists = await Checklist.find();
        res.send(checklists);
    } catch (error) {
        res.status(500).send("Error retrieving checklists: " + error.message);
    }
});

app.post("/api/checklists", async (req, res) => {
    try {
        const newChecklist = new Checklist({
            name: req.body.name,
            items: req.body.items
        });
        const savedChecklist = await newChecklist.save();
        res.status(201).send(savedChecklist);
    } catch (error) {
        res.status(500).send("Error creating checklist: " + error.message);
    }
});

app.put("/api/checklists/:id", async (req, res) => {
    try {
        const updatedChecklist = await Checklist.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                items: req.body.items
            },
            { new: true }
        );
        if (!updatedChecklist) {
            return res.status(404).send("Checklist not found.");
        }
        res.send(updatedChecklist);
    } catch (error) {
        res.status(500).send("Error updating checklist: " + error.message);
    }
});

app.delete("/api/checklists/:id", async (req, res) => {
    try {
        const deletedChecklist = await Checklist.findByIdAndDelete(req.params.id);
        if (!deletedChecklist) {
            return res.status(404).send("Checklist not found.");
        }
        res.send(deletedChecklist);
    } catch (error) {
        res.status(500).send("Error deleting checklist: " + error.message);
    }
});

// Goal-Tracker Endpoints
app.get("/api/goals", async (req, res) => {
    try {
        const goals = await Goal.find();
        res.send(goals);
    } catch (error) {
        res.status(500).send("Error retrieving goals: " + error.message);
    }
});

app.post("/api/goals", async (req, res) => {
    try {
        const newGoal = new Goal({
            name: req.body.name,
            description: req.body.description,
            due_date: req.body.due_date,
            progress: req.body.progress,
            notes: req.body.notes
        });
        const savedGoal = await newGoal.save();
        res.status(201).send(savedGoal);
    } catch (error) {
        res.status(500).send("Error creating goal: " + error.message);
    }
});

app.put("/api/goals/:id", async (req, res) => {
    try {
        const updatedGoal = await Goal.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                due_date: req.body.due_date,
                progress: req.body.progress,
                notes: req.body.notes
            },
            { new: true }
        );
        if (!updatedGoal) {
            return res.status(404).send("Goal not found.");
        }
        res.send(updatedGoal);
    } catch (error) {
        res.status(500).send("Error updating goal: " + error.message);
    }
});

app.delete("/api/goals/:id", async (req, res) => {
    try {
        const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
        if (!deletedGoal) {
            return res.status(404).send("Goal not found.");
        }
        res.send(deletedGoal);
    } catch (error) {
        res.status(500).send("Error deleting goal: " + error.message);
    }
});

// Calendar Endpoints
app.get("/api/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.send(events);
    } catch (error) {
        res.status(500).send("Error retrieving events: " + error.message);
    }
});

app.post("/api/events", async (req, res) => {
    try {
        const newEvent = new Event({
            date: req.body.date,
            time: req.body.time,
            description: req.body.description
        });
        const savedEvent = await newEvent.save();
        res.status(201).send(savedEvent);
    } catch (error) {
        res.status(500).send("Error creating event: " + error.message);
    }
});

app.put("/api/events/:id", async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            {
                date: req.body.date,
                time: req.body.time,
                description: req.body.description
            },
            { new: true }
        );
        if (!updatedEvent) {
            return res.status(404).send("Event not found.");
        }
        res.send(updatedEvent);
    } catch (error) {
        res.status(500).send("Error updating event: " + error.message);
    }
});

app.delete("/api/events/:id", async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).send("Event not found.");
        }
        res.send(deletedEvent);
    } catch (error) {
        res.status(500).send("Error deleting event: " + error.message);
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/hub/index.html");
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
