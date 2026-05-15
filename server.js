require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('./models/User');

const app = express();

const PORT = process.env.PORT;

app.use(helmet());
app.use(cors({
    origin: `http://localhost:${PORT}`,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'Wrong email' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Wrong password' });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/energy_efficiency')
    .then(() => {
        app.listen(PORT, () => {
            console.log(`IP: http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('Failure to connect to DB:', err));