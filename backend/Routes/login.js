// const { User } = require('../Models/user.model'); 
// const bcrypt = require('bcrypt'); 
// const express = require('express');
// const router = express.Router();

// const loginRouter = router.post('/login', async (req, res) => {
//     // Basic validation to ensure email and password are provided
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).send('Email and password are required.');
//     }

//     // Check if the user with the provided email exists
//     let user = await User.findOne({ email: req.body.email });
//     if (!user) {
//         return res.status(400).send('Invalid email or password.');
//     }

//     // Compare the provided password with the hashed password stored in the database
//     const validPassword = await bcrypt.compare(req.body.password, user.password);
//     if (!validPassword) {
//         return res.status(400).send('Invalid email or password.');
//     }

//     // At this point, authentication is successful
//     // Redirect the user to the task.html page
//     return res.redirect('/task.html');
// });

// module.exports = loginRouter;

const { User } = require('../Models/user.model');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

// Handle POST request to /login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).send('Invalid email or password.');
        }

        // If authentication is successful, redirect to task page
        return res.redirect('/task');
    } catch (error) {
        return res.status(500).send('An error occurred.');
    }
});

module.exports = router;

