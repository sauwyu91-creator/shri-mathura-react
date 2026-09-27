import { useState } from 'react';
import './App.css';
import poster from './assets/tour-poster.png';
const API_BASE_URL = `http://${window.location.hostname}:5000`;

const destinations = [
  [
    '🛕',
    'Shri Krishna Janmabhoomi',
    'Experience the sacred birthplace of Lord Krishna.',
  ],
  [
    '🙏',
    'Banke Bihari Mandir',
    'Seek divine blessings in the heart of Vrindavan.',
  ],
  ['✨', 'Prem Mandir', 'Witness beautiful lights and divine architecture.'],
  [
    '🌸',
    'ISKCON Temple',
    'Feel the peaceful spiritual atmosphere of Vrindavan.',
  ],
  ['🐄', 'Gokul', 'Explore the beautiful childhood memories of Krishna.'],
  ['⛰️', 'Govardhan', 'Visit the sacred Govardhan Parvat and surroundings.'],
  ['🌺', 'Barsana', 'Discover the divine land of Radha Rani.'],
];

const rentals = [
  {
    icon: '🚗',
    label: 'WITH DRIVER',
    title: 'Car Rental',
    text: 'Comfortable cars with experienced drivers for local sightseeing, airport transfers, and outstation family trips.',
    points: [
      'Local & Outstation',
      'Airport Transfer',
      'Family Trips',
      'All India Travel',
    ],
  },
  {
    icon: '🚘',
    label: 'SELF DRIVE',
    title: 'Self Drive Car',
    text: 'Enjoy the freedom of driving your own rental car for city trips, road trips, and weekend getaways.',
    points: [
      'Flexible Travel',
      'City & Outstation',
      'Weekend Trips',
      'Long Distance',
    ],
    featured: true,
  },
  {
    icon: '🏍️',
    label: 'BIKE RENTAL',
    title: 'Bike Rental',
    text: 'Affordable bikes for local sightseeing, daily travel, and exploring Mathura–Vrindavan freely.',
    points: [
      'Daily Rental',
      'Local Sightseeing',
      'Short Trips',
      'Easy Booking',
    ],
  },
];

const features = [
  [
    '🏨',
    'Hotel Stay',
    'Handpicked comfortable accommodation during your journey.',
  ],
  [
    '🚌',
    'Safe Travel',
    'Clean, well-maintained vehicles with expert local drivers.',
  ],
  [
    '🍽️',
    'Delicious Meals',
    'Enjoy hygienic, pure vegetarian local food options.',
  ],
  [
    '📸',
    'Guided Sightseeing',
    'Explore famous temples and spiritual landmarks smoothly.',
  ],
];

function App() {
  // Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [currentUser, setCurrentUser] = useState(null);
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenu, setMobileMenu] = useState(false);

  // Advance Booking Form State
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    phone: '',
    serviceType: 'Tour Package (3 Days)',
    travelDate: '',
    pickupLocation: '',
    notes: '',
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      authMode === 'login'
        ? `${API_BASE_URL}/api/login`
        : `${API_BASE_URL}/api/signup`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      if (data.success) {
        if (authMode === 'login') {
          setIsLoggedIn(true);
          setCurrentUser(data.user);
        } else {
          alert('Signup successful! Please login now.');
          setAuthMode('login');
        }
      } else {
        alert(data.message || 'Authentication failed!');
      }
    } catch (err) {
      console.error(err);
      alert('Server connection error. Make sure backend is running.');
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm),
      });
      const data = await response.json();
      if (data.success) {
        setBookingSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error! Make sure backend is running.');
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Agar user logged in nahi hai, toh Login/Signup screen dikhao
  if (!isLoggedIn) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="logo-circle" style={{ margin: '0 auto 15px' }}>
            🛕
          </div>
          <h2>Shri Mathura Tour & Travels</h2>
          <p className="auth-subtitle">
            Radhe Radhe • Please {authMode === 'login' ? 'login' : 'sign up'} to
            continue
          </p>

          <div className="auth-tabs" role="tablist" aria-label="Authentication">
            <button
              type="button"
              className={authMode === 'login' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => { setAuthMode('login'); setAuthForm({ name: '', email: '', password: '', phone: '' }); }}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === 'signup' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => { setAuthMode('signup'); setAuthForm({ name: '', email: '', password: '', phone: '' }); }}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="auth-form">
            {authMode === 'signup' && (
              <label>
                Full Name *
                <input
                  type="text"
                  name="name"
                  value={authForm.name}
                  onChange={handleAuthChange}
                  placeholder="Enter your name"
                  required
                />
              </label>
            )}
            <label>
              Email Address *
              <input
                type="email"
                name="email"
                value={authForm.email}
                onChange={handleAuthChange}
                placeholder="Enter email"
                required
              />
            </label>
            <label>
              Password *
              <input
                type="password"
                name="password"
                value={authForm.password}
                onChange={handleAuthChange}
                placeholder="Enter password"
                required
              />
            </label>
            {authMode === 'signup' && (
              <label>
                Mobile Number
                <input
                  type="tel"
                  name="phone"
                  value={authForm.phone}
                  onChange={handleAuthChange}
                  placeholder="10-digit mobile number"
                />
              </label>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
            >
              {authMode === 'login' ? 'Login 🚀' : 'Create Account 🚀'}
            </button>
          </form>

          <div className="auth-switch">
            {authMode === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button onClick={() => { setAuthMode('signup'); setAuthForm({ name: '', email: '', password: '', phone: '' }); }}>Sign Up</button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => { setAuthMode('login'); setAuthForm({ name: '', email: '', password: '', phone: '' }); }}>Login</button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Website After Login
  return (
    <div className="website">
      {/* Top Bar */}
      <div className="topbar">
        <div>
          🙏 Radhe Radhe • Welcome, {currentUser ? currentUser.name : 'Devotee'}
        </div>
        <div className="topbar-right">
          <span>📍 Mathura, U.P.</span>
          <a href="tel:+919119711375">📞 +91 91197-11375</a>
          <button onClick={() => setIsLoggedIn(false)} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <header className="navbar">
        <div className="nav-container">
          <button className="logo" onClick={() => navigateTo('home')}>
            <div className="logo-circle">🛕</div>
            <div className="logo-text">
              <strong>Shri Mathura</strong>
              <span>Tour & Travels</span>
            </div>
          </button>

          <nav className={mobileMenu ? 'nav-links open' : 'nav-links'}>
            <button
              className={currentPage === 'home' ? 'active-link' : ''}
              onClick={() => navigateTo('home')}
            >
              Home
            </button>
            <button
              className={currentPage === 'tours' ? 'active-link' : ''}
              onClick={() => navigateTo('tours')}
            >
              Tours
            </button>
            <button
              className={currentPage === 'rentals' ? 'active-link' : ''}
              onClick={() => navigateTo('rentals')}
            >
              Rentals
            </button>
            <button
              className={currentPage === 'destinations' ? 'active-link' : ''}
              onClick={() => navigateTo('destinations')}
            >
              Places
            </button>
            <button
              className={
                currentPage === 'booking'
                  ? 'active-link booking-highlight'
                  : 'booking-highlight'
              }
              onClick={() => navigateTo('booking')}
            >
              📅 Advance Booking
            </button>
            <button
              className={currentPage === 'contact' ? 'active-link' : ''}
              onClick={() => navigateTo('contact')}
            >
              Contact
            </button>
          </nav>

          <div className="nav-actions">
            <button className="nav-call" onClick={() => navigateTo('booking')}>
              📅 Book Now
            </button>
            <button
              className="menu-button"
              aria-label="Open menu"
              onClick={() => setMobileMenu((v) => !v)}
            >
              {mobileMenu ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <div className="page-fade">
            <section className="hero">
              <div className="hero-content">
                <div className="eyebrow">
                  ✨ SPIRITUAL JOURNEY WITH DIVINE VIBES
                </div>
                <h1>
                  Discover the <span>Divine Beauty</span> of Braj Dham
                </h1>
                <p className="hero-description">
                  Experience Mathura, Vrindavan, and all of India with
                  comfortable tour packages, car rentals, self-drive cars, and
                  bike rentals tailored for your peace of mind.
                </p>

                <div className="hero-price-card">
                  <div>
                    <small>3 DAYS TOUR PACKAGE</small>
                    <strong>₹5,000</strong>
                    <span>Starting price • Per Person</span>
                  </div>
                  <div className="hero-checks">
                    <span>✓ Hotel Stay</span>
                    <span>✓ Meals</span>
                    <span>✓ Travel</span>
                    <span>✓ Sightseeing</span>
                  </div>
                </div>

                <div className="hero-buttons">
                  <button
                    onClick={() => navigateTo('tours')}
                    className="btn btn-primary"
                  >
                    Explore Tour Packages <span>→</span>
                  </button>
                  <button
                    onClick={() => navigateTo('booking')}
                    className="btn btn-outline"
                  >
                    📅 Advance Booking
                  </button>
                  <a
                    href="https://wa.me/919119711375"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp"
                  >
                    💬 WhatsApp Chat
                  </a>
                </div>

                <div className="trust-row">
                  <span>⭐ 100% Trusted Agency</span>
                  <span>🛡️ Family Friendly</span>
                  <span>🇮🇳 All India Service</span>
                </div>
              </div>

              <div className="hero-visual">
                <div className="poster-frame">
                  <img
                    src={poster}
                    alt="Shri Mathura Tour and Travels poster"
                  />
                  <div className="poster-glow" />
                </div>
                <div className="hero-floating-card">
                  <span className="floating-icon">🙏</span>
                  <div>
                    <strong>Chalo Braj Dham</strong>
                    <small>Divine • Peaceful • Memorable</small>
                  </div>
                </div>
              </div>
            </section>

            <section className="stats">
              <div>
                <b>7+</b>
                <span>Sacred Destinations</span>
              </div>
              <div>
                <b>3</b>
                <span>Rental Categories</span>
              </div>
              <div>
                <b>3 Days</b>
                <span>Signature Tour</span>
              </div>
              <div>
                <b>24/7</b>
                <span>Customer Support</span>
              </div>
            </section>

            <section className="section">
              <div className="section-heading">
                <div className="eyebrow">WHY TRAVEL WITH US</div>
                <h2>
                  Your Comfort, <em>Our Priority</em>
                </h2>
                <p>
                  We take care of every detail so you can focus completely on
                  your spiritual journey.
                </p>
              </div>
              <div className="features-grid">
                {features.map(([icon, title, text]) => (
                  <article className="feature-card" key={title}>
                    <div className="feature-icon">{icon}</div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TOURS PAGE */}
        {currentPage === 'tours' && (
          <div className="page-fade section">
            <div className="section-heading">
              <div className="eyebrow">OUR SIGNATURE TOUR</div>
              <h2>
                3 Days Mathura – Vrindavan <em>Spiritual Tour</em>
              </h2>
              <p>
                Immerse yourself in the divine aura and rich heritage of Braj
                Dham.
              </p>
            </div>

            <div className="package-card">
              <div className="package-copy">
                <div className="pill">
                  3 DAYS • MATHURA – VRINDAVAN – BARSANA
                </div>
                <h3>
                  Complete Braj Dham <em>Experience</em>
                </h3>
                <p>
                  Explore Mathura Janmabhoomi, Banke Bihari, Prem Mandir, Gokul,
                  Govardhan, and Barsana with effortless logistics and
                  comfortable travel.
                </p>
                <div className="package-price">
                  <span>Special package starting from</span>
                  <b>₹5,000</b>
                  <small>Per Person</small>
                </div>
                <div className="included-list">
                  <span>✓ Comfortable Hotel Stay</span>
                  <span>✓ Hygienic Meals</span>
                  <span>✓ Safe AC/Non-AC Travel</span>
                  <span>✓ Dedicated Temple Darshan</span>
                  <span>✓ Expert Local Guide</span>
                  <span>✓ Family & Group Friendly</span>
                </div>
                <div className="package-actions">
                  <button
                    onClick={() => navigateTo('booking')}
                    className="btn btn-primary"
                  >
                    📅 Book This Tour
                  </button>
                  <a
                    href="https://wa.me/919119711375"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp"
                  >
                    💬 Enquire on WhatsApp
                  </a>
                </div>
              </div>
              <div className="itinerary">
                <div className="itinerary-title">YOUR ITINERARY OVERVIEW</div>
                <div className="timeline-item">
                  <span>01</span>
                  <div>
                    <b>Mathura Day</b>
                    <p>
                      Shri Krishna Janmabhoomi, Dwarkadhish Temple & Yamuna
                      Ghats
                    </p>
                  </div>
                </div>
                <div className="timeline-item">
                  <span>02</span>
                  <div>
                    <b>Vrindavan Day</b>
                    <p>Banke Bihari Mandir, Prem Mandir, ISKCON & Nidhivan</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <span>03</span>
                  <div>
                    <b>Braj Circuit</b>
                    <p>
                      Gokul childhood sites, Govardhan Parvat & Barsana Radha
                      Rani Temple
                    </p>
                  </div>
                </div>
                <div className="mini-note">
                  🙏 Customizable itineraries available upon request for
                  families & groups.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RENTALS PAGE */}
        {currentPage === 'rentals' && (
          <div className="page-fade section">
            <div className="section-heading">
              <div className="eyebrow">FLEXIBLE TRANSPORTATION</div>
              <h2>
                Rent. Ride. <em>Explore India.</em>
              </h2>
              <p>
                Choose clean, reliable vehicles for your local sightseeing or
                pan-India journeys.
              </p>
            </div>
            <div className="rental-grid">
              {rentals.map((rental) => (
                <article
                  className={`rental-card ${rental.featured ? 'featured' : ''}`}
                  key={rental.title}
                >
                  {rental.featured && (
                    <div className="popular">⭐ MOST POPULAR</div>
                  )}
                  <div className="service-icon">{rental.icon}</div>
                  <div className="service-label">{rental.label}</div>
                  <h3>{rental.title}</h3>
                  <p>{rental.text}</p>
                  <ul>
                    {rental.points.map((p) => (
                      <li key={p}>✓ {p}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigateTo('booking')}
                    className="service-button"
                  >
                    Book Advance Ride →
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* DESTINATIONS PAGE */}
        {currentPage === 'destinations' && (
          <div className="page-fade section">
            <div className="section-heading">
              <div className="eyebrow">SACRED SITES</div>
              <h2>
                Places You Will <em>Explore</em>
              </h2>
              <p>Discover the divine landmarks of Braj Dham with us.</p>
            </div>
            <div className="destination-grid">
              {destinations.map(([icon, name, text]) => (
                <article className="destination-card" key={name}>
                  <div className="destination-icon">{icon}</div>
                  <h3>{name}</h3>
                  <p>{text}</p>
                  <button
                    onClick={() => navigateTo('booking')}
                    className="destination-link-btn"
                  >
                    Book Visit <span>→</span>
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ADVANCE BOOKING PAGE */}
        {currentPage === 'booking' && (
          <div className="page-fade section">
            <div className="section-heading">
              <div className="eyebrow">RESERVE IN ADVANCE</div>
              <h2>
                Online <em>Advance Booking</em>
              </h2>
              <p>
                Secure your tour package or vehicle rental ahead of time for a
                seamless journey.
              </p>
            </div>
            <div className="booking-card-wrapper">
              {!bookingSubmitted ? (
                <form className="booking-form" onSubmit={handleBookingSubmit}>
                  <div className="form-grid">
                    <label>
                      Full Name *
                      <input
                        type="text"
                        name="fullName"
                        value={bookingForm.fullName}
                        onChange={handleBookingChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </label>
                    <label>
                      Mobile Number (WhatsApp) *
                      <input
                        type="tel"
                        name="phone"
                        value={bookingForm.phone}
                        onChange={handleBookingChange}
                        placeholder="10-digit mobile number"
                        pattern="[6-9][0-9]{9}"
                        maxLength="10"
                        required
                      />
                    </label>
                    <label>
                      Select Service *
                      <select
                        name="serviceType"
                        value={bookingForm.serviceType}
                        onChange={handleBookingChange}
                        required
                      >
                        <option>
                          Tour Package (3 Days Braj Dham - ₹5,000)
                        </option>
                        <option>Car Rental with Driver</option>
                        <option>Self Drive Car Rental</option>
                        <option>Bike Rental</option>
                        <option>Custom Tour / Outstation Cab</option>
                      </select>
                    </label>
                    <label>
                      Travel / Booking Date *
                      <input
                        type="date"
                        name="travelDate"
                        value={bookingForm.travelDate}
                        onChange={handleBookingChange}
                        required
                      />
                    </label>
                    <label className="form-full">
                      Pickup Location / City *
                      <input
                        type="text"
                        name="pickupLocation"
                        value={bookingForm.pickupLocation}
                        onChange={handleBookingChange}
                        placeholder="e.g., Mathura Railway Station, Hotel"
                        required
                      />
                    </label>
                    <label className="form-full">
                      Special Requests / Notes (Optional)
                      <textarea
                        name="notes"
                        value={bookingForm.notes}
                        onChange={handleBookingChange}
                        rows="3"
                        placeholder="Mention any specific requirements..."
                      ></textarea>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary booking-submit-btn"
                  >
                    Confirm Advance Booking 🚀
                  </button>
                </form>
              ) : (
                <div className="booking-success-box">
                  <div className="success-icon">🎉</div>
                  <h3>Booking Request Saved to Database!</h3>
                  <p>
                    Thank you, <strong>{bookingForm.fullName}</strong>. Your
                    booking for <strong>{bookingForm.serviceType}</strong> is
                    confirmed.
                  </p>
                  <button
                    onClick={() => setBookingSubmitted(false)}
                    className="btn btn-outline"
                    style={{ marginTop: '20px' }}
                  >
                    Make Another Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTACT PAGE */}
        {currentPage === 'contact' && (
          <div className="page-fade section">
            <div className="contact-card page-contact">
              <div>
                <div className="eyebrow">GET IN TOUCH</div>
                <h2>
                  Shri Mathura
                  <br />
                  Tour & Travels
                </h2>
                <p>Your Trust • Our Respect</p>
              </div>
              <div className="contact-details">
                <a href="tel:+919119711375">
                  📞 <strong>+91 91197-11375</strong>
                </a>
                <p>
                  📍 57, Hanuman Nagar,
                  <br />
                  Dholi Pyau, Mathura (U.P.)
                </p>
              </div>
              <div className="contact-actions">
                <a className="btn btn-primary" href="tel:+919119711375">
                  Call Now
                </a>
                <a
                  className="btn btn-whatsapp"
                  href="https://wa.me/919119711375"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-main">
          <div className="footer-brand">🛕 Shri Mathura Tour & Travels</div>
          <p>Your Trust • Our Respect</p>
        </div>
        <div className="footer-links">
          <button onClick={() => navigateTo('home')}>Home</button>
          <button onClick={() => navigateTo('tours')}>Tours</button>
          <button onClick={() => navigateTo('rentals')}>Rentals</button>
          <button onClick={() => navigateTo('destinations')}>Places</button>
          <button onClick={() => navigateTo('booking')}>Advance Booking</button>
          <button onClick={() => navigateTo('contact')}>Contact</button>
        </div>
        <small>© 2026 Shri Mathura Tour & Travels • All Rights Reserved</small>
      </footer>

      {/* Floating WhatsApp */}
      <a
        className="floating-whatsapp"
        href="https://wa.me/919119711375"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        💬
      </a>
    </div>
  );
}

export default App;
