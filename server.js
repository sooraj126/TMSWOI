const express = require('express');
const path = require('path');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./backend/Models/user.model'); 

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



const PORT = process.env.PORT || 3900;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
