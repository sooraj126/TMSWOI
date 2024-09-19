const express = require('express');
const path = require('path');
const app = express();



const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./backend/Modal/user.modal'); 

// Connect to MongoDB
const mongoUri = 'mongodb+srv://soorajwork6:QuCQHpVEp7VRjRZq@cluster0.y6t2c.mongodb.net/?retryWrites=true&w=majority';

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB', error));




app.use('/css', express.static(path.join(__dirname, 'frontend', 'css')));
app.use('/js', express.static(path.join(__dirname, 'frontend', 'js')));


app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        const newUser = new User({ email, password });

        await newUser.save();

        res.redirect('/task');
    } catch (error) {
        console.error('Error saving user to the database', error);
        res.status(500).send('Error registering user');
    }
});


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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
