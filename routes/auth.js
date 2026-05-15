const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { error: 'Забагато спроб входу. Спробуйте пізніше.' }
});

router.post('/register',
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').notEmpty().trim().escape(),
    body('role').isIn(['energy_manager', 'technologist', 'ceo']),
    async (req, res) => {

        const err = validationResult(req);

        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        try {
            const { email, password, name, role } = req.body;
            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ error: 'The user already exists' });
            }
            const hashPassword = await bcrypt.hash(password, 8);
            const createUser = await User.create({
                email,
                password: hashPassword,
                name,
                role
            });
            res.status(201).json({ message: 'Registration was successful', user: { id: createUser.id, email: createUser.email, role: createUser.role } });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
)

router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                name: req.user.name,
                role: req.user.role
            }
        });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

router.post('/login',
    loginLimiter,
    passport.authenticate('local'),
    (req, res) => {
        res.json({ message: 'Login success', user: { id: req.user.id, email: req.user.email, role: req.user.role } });
    }
);

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return res.status(500).json({ error: err.message }); }
        res.json({ message: 'Logout success' });
    });
});

module.exports = router;