
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();


const Task = require('./backend/Modal/task.modal'); 


const uri = process.env.MONGODB_URI || "mongodb+srv://s224238367:uh1dhGnQbReJzQX7@cluster0.ueb59mc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); 


app.use('/css', express.static(path.join(__dirname, 'frontend', 'css')));
app.use('/js', express.static(path.join(__dirname, 'frontend', 'js')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'views', 'signup.html'));
});

app.get('/ontrack', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'views', 'ontrack.html'));
});

app.get('/task', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'views', 'task.html'));
});


app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});


app.post('/api/tasks', async (req, res) => {
  try {
    const { title, deadline, description, priority, category } = req.body;

    if (!title || !deadline || !priority || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newTask = new Task({
      title,
      deadline: new Date(deadline),
      description: description || 'N/A',
      priority,
      category
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error.message);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});


app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required for update' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error.message);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});


app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
