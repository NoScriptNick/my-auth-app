const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const BookedTimes = require('./models/BookedTimes');

const times = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

mongoose.connect('mongodb+srv://DatabaseUser1:BluebirdSelfish77834!@cluster0.e1h7l.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    // Fetch all entries from BookedTimes
    const bookedTimes = await BookedTimes.find({});

    // Delete all entries from BookedTimes
    await BookedTimes.deleteMany({});

    // Initialize available times
    console.log('Connected to MongoDB');
    for (const time of times) {
        await Booking.updateOne(
            { service: 'facial', time },
            { $setOnInsert: { service: 'facial', time, user: null } },
            { upsert: true }
        );
    }
    console.log('Initialized available times');
    mongoose.disconnect();
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});