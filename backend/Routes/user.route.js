const express = require('express');
const { User } = require('../Models/user.model');
const router = express.Router();

// Fetch user details by ID
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send('An error occurred.');
    }
});

module.exports = router;
