const mongoose = require('mongoose');

//Booked times table schema
const bookedTimesSchema = new mongoose.Schema({
    service: String,
    time: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const BookedTimes = mongoose.model('BookedTimes', bookedTimesSchema);

module.exports = BookedTimes;