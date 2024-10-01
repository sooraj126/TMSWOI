const express = require('express');
const router = express.Router();
const OnTrack = require('../Models/ontrack.model'); 


// Fetch OnTrack link by user ID for fetching the link on ontrack page

router.get('/:userId', async (req, res) => {
    // console.log("heythere");
    try {
        const onTrackData = await OnTrack.findOne({ userId: req.params.userId });
        // console.log("onTrackData");
        if (!onTrackData || !onTrackData.onTrackLink) {
            return res.status(404).json({ link: null }); // Return null if not found
        }
        res.json({ link: onTrackData.onTrackLink }); // Return the OnTrack link
    } catch (error) {
        console.error('Error fetching OnTrack link:', error);
        res.status(500).send('An error occurred while fetching the OnTrack link.');
    }
});

module.exports = router;
