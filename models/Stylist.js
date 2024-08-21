const mongoose = require('mongoose');

const StylistSchema = new mongoose.Schema({
    name: String,
    availableTimes: [String]  // Array of available time slots
});

const Stylist = mongoose.model('Stylist', bookingSchema);

module.exports = Stylist;