
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
        const error = new Error('All fields are required');
        error.statusCode = 400;
        throw error;
    }

    // Check if user exists
    const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
        const error = new Error('User already exists');
        error.statusCode = 409; // Conflict
        throw error;
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
            role: user.role
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

export const updateUserProfileService = async (userId, name, age, gender, oldPassword, newPassword) => {
    // 1. Fetch user
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    let userData = null;

    if (!user) {
        throw new Error('User not found');
    }

    // 2. Handle password change
    if (oldPassword && newPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error('Old password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        userData = await pool.query(
            `UPDATE users SET name = $1, age = $2, gender = $3, password = $4, updated_at = NOW() WHERE id = $5 RETURNING *`,
            [name, age, gender, hashedNewPassword, userId]
        );
    } else {
        // 3. Only profile update
        userData = await pool.query(
            `UPDATE users SET name = $1, age = $2, gender = $3, updated_at = NOW() 
             WHERE id = $4 RETURNING *`,
            [name, age, gender, userId]
        );
    }
    return userData.rows[0];
};