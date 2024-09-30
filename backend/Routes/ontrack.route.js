const express = require('express');
const router = express.Router();
const OnTrack = require('../Models/ontrack.model');


router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const onTrackData = await OnTrack.findOne({ userId });
        if (!onTrackData) {
            return res.status(404).json({ message: 'OnTrack link not found.' });
        }
        res.json(onTrackData);
    } catch (error) {
        console.error('Error retrieving OnTrack link:', error);
        res.status(500).json({ message: 'Error retrieving OnTrack link' });
    }
});


// POST route to save OnTrack link
router.post('/', async (req, res) => {
    const { userId, onTrackLink } = req.body;

    try {
        // Check  link already exists for the user
        let onTrackData = await OnTrack.findOne({ userId });
        if (onTrackData) {
            // Update existing OnTrack link
            onTrackData.onTrackLink = onTrackLink;
            await onTrackData.save();
            return res.json(onTrackData);
        } else {
            // Create new OnTrack link
            onTrackData = new OnTrack({ userId, onTrackLink });
            await onTrackData.save();
            res.status(201).json(onTrackData);
        }
    } catch (error) {
        console.error('Error saving OnTrack link:', error);
        res.status(500).json({ message: 'Error saving OnTrack link' });
    }
});



module.exports = router;
