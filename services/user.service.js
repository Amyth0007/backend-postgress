
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from './../config/db.config.js'


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'MS Dhoni the untold story';

// ------------------------
// Register User
// ------------------------
export const createUser = async (userData) => {
    const { username, email, password } = userData;

    if (!username || !email || !password) {
        throw new Error('All fields are required');
    }

    // Check if user exists
    const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
        [username, email, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d',
    });

    return {
        message: 'User registered successfully',
        user,
        token
    };
};

// ------------------------
// Login User
// ------------------------
export const loginUser = async (userData) => {
    const { email, password } = userData;

    if (!email || !password) {
        throw new Error('All fields are required');
    }

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d',
    });

    return {
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        token
    };
};




export const getUser = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );

    // result.rows[0] will be the user (or undefined if not found)
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user:', error.message);
    throw new Error('Error fetching user data');
  }
};

