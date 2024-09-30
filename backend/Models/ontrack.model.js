const mongoose = require('mongoose');

const onTrackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    onTrackLink: {
        type: String,
        required: true
    }
});

const OnTrack = mongoose.model('OnTrack', onTrackSchema);

module.exports = OnTrack;
