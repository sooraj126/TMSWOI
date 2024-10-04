const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);  // This serves the socket.io.js file

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./backend/Models/user.model'); 
const OnTrack = require('./backend/Models/ontrack.model');
const dotenv = require('dotenv');
const cors = require('cors'); 

const Task = require('./backend/Modal/task.modal'); 

dotenv.config();

// Connect to MongoDB
const mongoUri = 'mongodb+srv://anandishika07:mALobWvqSSCEVVoM@cluster0.jfdvplt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB', error));


app.use('/css', express.static(path.join(__dirname, 'frontend', 'css')));
app.use('/js', express.static(path.join(__dirname, 'frontend', 'js')));

app.use('/api', require('./backend/Routes/register'));
app.use('/api', require('./backend/Routes/login'));
app.use('/api', require('./backend/Routes/user.route')); 
app.use('/api/ontrack', require('./backend/Routes/ontrack.route'));
app.use('/api/ontracklink', require('./backend/Routes/ontracklink.route'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



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

// Get all tasks
app.get('/api/tasks/:userId', async (req, res) => {
  const userId = req.params.userId;
    try {
      const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
  });
  
  // Create a new task
  app.post('/api/tasks', async (req, res) => {
    try {
      const { title, deadline, description, priority, category ,userId } = req.body;
  
      // Basic validation
      if (!title || !deadline || !priority || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newTask = new Task({
        title,
        deadline: new Date(deadline),
        description: description || 'N/A',
        priority,
        category,
        userId
      });
  
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error.message);
      res.status(500).json({ message: 'Error creating task', error: error.message });
    }
  });
  
  // Update a task's status
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
  
  // Delete a task
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



//socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected');

  // when someone connects
  io.emit('message', 'A new user has connected.');
  socket.on('disconnect', () => {
    console.log('User disconnected, starting 5 seconds countdown');
    setTimeout(() => {
      console.log('5 seconds passed, notifying other users');
      io.emit('message', 'A user has been disconnected for more than 5 seconds.');
    }, 5000); // 5 seconds delay
  });

  socket.on('message', (msg) => {
    console.log('Message received: ' + msg);
    io.emit('message', msg); // Send the message to all clients
  });
});

// const PORT = process.env.PORT || 4900;
// if (process.env.NODE_ENV !== 'test') {
//     const PORT = process.env.PORT || 4900;
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   }

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;