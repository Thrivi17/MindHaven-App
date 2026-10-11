const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// pass the database pool into this router
module.exports = (pool) => {

    // SIGNUP ROUTE
    router.post('/signup', async (req, res) => {
        const { username, email, password } = req.body;
        try {
            // Check if user already exists
            const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userCheck.rows.length > 0) {
                return res.status(400).json({ error: 'User with this email already exists.' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert new user
            const newUser = await pool.query(
                'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
                [username, email, hashedPassword]
            );

            // Initialize default garden state for the new user
            const userId = newUser.rows[0].id;
            await pool.query(
                'INSERT INTO garden_states (user_id, streak_count, growth_level) VALUES ($1, 0, 1)',
                [userId]
            );

            res.status(201).json({ message: 'User registered successfully!', user: newUser.rows[0] });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error during signup.' });
        }
    });

    // LOGIN ROUTE
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            // Check if user exists
            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (user.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid email or password.' });
            }

            // Validate password
            const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
            if (!validPassword) {
                return res.status(400).json({ error: 'Invalid email or password.' });
            }

            // Create JWT Token
            const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'Logged in successfully!',
                token,
                user: { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email }
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error during login.' });
        }
    });

    return router;
};