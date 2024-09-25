const { User, validateUser } = require('../Models/user.model');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const registerRouter = router.post('/register', async (req, res) => {
    // Manually check if password and confirm-password match
    if (req.body.password !== req.body["confirm-password"]) {
        return res.status(400).send('Password and confirm-password do not match');
    }

    // Remove confirm-password before validating the user data
    const { "confirm-password": _, ...userData } = req.body;

    // Validate the rest of the user data
    const { error } = validateUser(userData);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('User already exists. Please sign in');
    } else {
        try {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.password, salt);
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: password
            });
            await user.save();

            // Redirect to login page with a success query param
            return res.redirect('/login?success=true');
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
});

module.exports = registerRouter;
