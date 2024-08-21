const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const User = require('./models/User');  // Import User model
const Booking = require('./models/Booking');  // Import Booking model
const BookedTimes = require('./models/BookedTimes');  // Import BookedTimes model
const Stylist = require('./models/Stylist');  // Import Stylist model

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve HTML files from a separate directory
app.use(express.static(path.join(__dirname, 'html_views')));  // Serve .html files

// Connect to MongoDB
mongoose.connect('mongodb+srv://DatabaseUser1:BluebirdSelfish77834!@cluster0.e1h7l.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

// Session middleware with MongoDB store
app.use(session({
    secret: 'secret',  // You should replace this with a more secure secret in production
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://DatabaseUser1:BluebirdSelfish77834!@cluster0.e1h7l.mongodb.net/',
        collectionName: 'sessions'
    })
}));

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        next();
    }
}

// Root route
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(path.join(__dirname, 'views', 'register.html'));  // Serve register.html
    }
});

// Registration route
app.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(path.join(__dirname, 'views', 'register.html'));  // Serve register.html
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.send('Error registering user');
    }
});

// Login route
app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(path.join(__dirname, 'views', 'login.html'));  // Serve login.html
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.send('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send('Invalid username or password');
        }

        req.session.user = username;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.send('Error logging in');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/login');
    });
});

// Dashboard route
app.get('/dashboard', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));  // Serve dashboard.html
});

// Service routes
app.get('/services/hair', requireLogin, async (req, res) => {
    const bookings = await Booking.find({ service: 'hair' });
    const bookedTimes = await BookedTimes.find({ service: 'hair' });
    res.render('hair', { bookings, bookedTimes, user: req.session.user });
});

app.get('/services/manicure', requireLogin, async (req, res) => {
    const bookings = await Booking.find({ service: 'manicure' });
    const bookedTimes = await BookedTimes.find({ service: 'manicure' });
    res.render('manicure', { bookings, bookedTimes, user: req.session.user });
});

app.get('/services/facial', requireLogin, async (req, res) => {
    const bookings = await Booking.find({ service: 'facial' });
    const bookedTimes = await BookedTimes.find({ service: 'facial' });
    res.render('facial', { bookings, bookedTimes, user: req.session.user });
});

// Booking route
app.post('/book', requireLogin, async (req, res) => {
    const { service, time } = req.body;
    if (service && time) {
        const bookedTimes = new BookedTimes({ service, time, user: req.session.user._id});
        await bookedTimes.save();
        res.redirect(`/services/${service}`);
    } else {
        res.send('Error: Missing service or time');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
