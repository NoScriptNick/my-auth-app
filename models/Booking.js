const mongoose = require('mongoose');

//Booking table schema
const bookingSchema = new mongoose.Schema({
    service: {type: String, required: true},
    time: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    stylist: { type: mongoose.Schema.Types.ObjectId, ref: 'Stylist' }  // Reference to Stylist
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;