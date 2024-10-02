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
        // return res.redirect('/task');
        return res.redirect(`/task?id=${user._id}`);
    } catch (error) {
        return res.status(500).send('An error occurred.');
    }
});

module.exports = router;

