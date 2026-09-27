require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// MYSQL CONNECTION
// ===============================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ===============================
// CONNECT TO MYSQL
// ===============================
db.connect((err) => {
  if (err) {
    console.error('');
    console.error('❌ MYSQL DATABASE CONNECTION FAILED');
    console.error('----------------------------------------');
    console.error(err.message);
    console.error('----------------------------------------');
    console.error('⚠️ Check MySQL username, password and database name.');
    console.error('');
    return;
  }

  console.log('');
  console.log('========================================');
  console.log('✅ Connected to MySQL Database');
  console.log('📦 Database: shri_mathura');
  console.log('========================================');
  console.log('');
});

// ===============================
// TEST API
// ===============================
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Shri Mathura Tour & Travels backend is running!',
  });
});

// ===============================
// SIGNUP API
// ===============================
app.post('/api/signup', (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and password are required.',
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone ? phone.trim() : null;

  const query = `
    INSERT INTO app_users
      (name, email, password, phone)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [cleanName, cleanEmail, password, cleanPhone],
    (err, result) => {
      if (err) {
        console.error('❌ Signup error:', err);

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
    },
  );
});

// ===============================
// LOGIN API
// ===============================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  const query = `
    SELECT id, name, email, phone
    FROM app_users
    WHERE email = ? AND password = ?
      LIMIT 1
  `;

  db.query(query, [cleanEmail, password], (err, results) => {
    if (err) {
      console.error('❌ Login error:', err);

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

    return res.json({
      success: true,
      message: 'Login successful!',
      user: results[0],
    });
  });
});

// ===============================
// ADVANCE BOOKING API
// ===============================
app.post('/api/bookings', (req, res) => {
  const {
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
      full_name,
      phone,
      service_type,
      travel_date,
      pickup_location,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      fullName.trim(),
      phone.trim(),
      serviceType,
      travelDate,
      pickupLocation.trim(),
      notes ? notes.trim() : null,
    ],
    (err, result) => {
      if (err) {
        console.error('❌ Booking error:', err);

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
    },
  );
});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('========================================');
  console.log('🚩 Shri Mathura Tour & Travels Backend');
  console.log('========================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Local:   http://localhost:${PORT}/api/test`);
  console.log(`🌐 Network: http://192.168.1.4:${PORT}/api/test`);
  console.log('========================================');
  console.log('');
});