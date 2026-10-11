const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL Database (MindHaven)'))
    .catch(err => console.error('Database connection error', err.stack));

// Import and mount Auth routes
const authRouter = require('./auth')(pool);
app.use('/api/auth', authRouter);

// Basic Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the MindHaven API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`MindHaven backend server running on port ${PORT}`);
});