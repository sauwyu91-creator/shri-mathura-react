require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

/* ==========================================================================
   1. MIDDLEWARES
   ========================================================================== */
app.use(cors());
app.use(express.json());

/* ==========================================================================
   2. DATABASE CONNECTION POOL SETUP
   ========================================================================== */
const db = mysql.createPool({
  uri: process.env.MYSQL_PUBLIC_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MYSQL DATABASE CONNECTION FAILED:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL Database via Connection Pool');
  connection.release();
});

const JWT_SECRET = process.env.JWT_SECRET || 'shri_mathura_secret_key_2026';

/* ==========================================================================
   3. AUTH MIDDLEWARE (Token Verification)
   ========================================================================== */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

/* ==========================================================================
   4. API ROUTES
   ========================================================================== */

// Health Check Endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Shri Mathura Tour & Travels backend is running perfectly!',
  });
});

/* --------------------------------------------------------------------------
   A. AUTHENTICATION ENDPOINTS
   -------------------------------------------------------------------------- */

// Signup Endpoint
app.post('/api/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and password are required.',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO app_users (name, email, password, phone)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
        query,
        [
          name.trim(),
          email.trim().toLowerCase(),
          hashedPassword,
          phone ? phone.trim() : null,
        ],
        (err, result) => {
          if (err) {
            console.error('Signup error:', err);

            if (err.code === 'ER_DUP_ENTRY') {
              return res.status(400).json({
                success: false,
                message: 'This email is already registered. Please login.',
              });
            }

            return res.status(500).json({
              success: false,
              message: 'Database error while creating account.',
            });
          }

          return res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            userId: result.insertId,
          });
        }
    );
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  const query = `
    SELECT id, name, email, password, phone
    FROM app_users
    WHERE email = ?
      LIMIT 1
  `;

  db.query(query, [email.trim().toLowerCase()], async (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error while logging in.',
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const user = results[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    delete user.password;

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user,
    });
  });
});

/* --------------------------------------------------------------------------
   B. BOOKING ENDPOINTS
   -------------------------------------------------------------------------- */

// Save New Booking
app.post('/api/bookings', (req, res) => {
  const {
    userId,
    fullName,
    phone,
    serviceType,
    travelDate,
    pickupLocation,
    notes,
  } = req.body;

  if (!fullName || !phone || !serviceType || !travelDate || !pickupLocation) {
    return res.status(400).json({
      success: false,
      message: 'Please fill all required booking fields.',
    });
  }

  const query = `
    INSERT INTO bookings
    (
      user_id,
      full_name,
      phone,
      service_type,
      travel_date,
      pickup_location,
      notes,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  db.query(
      query,
      [
        userId || null,
        fullName.trim(),
        phone.trim(),
        serviceType,
        travelDate,
        pickupLocation.trim(),
        notes ? notes.trim() : null,
      ],
      (err, result) => {
        if (err) {
          console.error('Booking error:', err);

          return res.status(500).json({
            success: false,
            message: 'Database error while saving booking.',
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Booking saved successfully!',
          bookingId: result.insertId,
        });
      }
  );
});

// Get User's Booking History
app.get('/api/bookings/user/:userId', (req, res) => {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID.',
    });
  }

  const query = `
    SELECT
      id,
      full_name,
      phone,
      service_type,
      travel_date,
      pickup_location,
      notes,
      status,
      created_at
    FROM bookings
    WHERE user_id = ?
    ORDER BY id DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Booking history error:', err);

      return res.status(500).json({
        success: false,
        message: 'Database error while loading bookings.',
      });
    }

    return res.json({
      success: true,
      bookings: results,
    });
  });
});

/* --------------------------------------------------------------------------
   C. ADMIN ENDPOINTS
   -------------------------------------------------------------------------- */

// Fetch All Bookings for Admin
app.get('/api/admin/bookings', (req, res) => {
  const query = `
    SELECT b.*, u.email AS user_email
    FROM bookings b
    LEFT JOIN app_users u ON b.user_id = u.id
    ORDER BY b.id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Admin bookings error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error while loading admin bookings.',
      });
    }

    return res.json({
      success: true,
      bookings: results,
    });
  });
});

// Update Booking Status
app.patch('/api/admin/bookings/:id/status', (req, res) => {
  const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid booking status.',
    });
  }

  db.query(
      `UPDATE bookings SET status = ? WHERE id = ?`,
      [status, req.params.id],
      (err, result) => {
        if (err) {
          console.error('Status update error:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error while updating status.',
          });
        }

        if (!result.affectedRows) {
          return res.status(404).json({
            success: false,
            message: 'Booking not found.',
          });
        }

        return res.json({
          success: true,
          message: 'Booking status updated successfully.',
        });
      }
  );
});

/* ==========================================================================
   5. SERVER START
   ========================================================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Shri Mathura backend running on port ${PORT}`);
});