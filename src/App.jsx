import { useState } from 'react';
import './App.css';
import poster from './assets/tour-poster.png';

// ===============================
// LIVE BACKEND
// ===============================
const API_BASE_URL = 'https://shri-mathura-react.onrender.com';

const destinations = [
  ['🛕', 'Shri Krishna Janmabhoomi', 'Experience the sacred birthplace of Lord Krishna.'],
  ['🙏', 'Banke Bihari Mandir', 'Seek divine blessings in the heart of Vrindavan.'],
  ['✨', 'Prem Mandir', 'Witness beautiful lights and divine architecture.'],
  ['🌸', 'ISKCON Temple', 'Feel the peaceful spiritual atmosphere of Vrindavan.'],
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
    points: ['Local & Outstation', 'Airport Transfer', 'Family Trips', 'All India Travel'],
  },
  {
    icon: '🚘',
    label: 'SELF DRIVE',
    title: 'Self Drive Car',
    text: 'Enjoy the freedom of driving your own rental car for city trips, road trips, and weekend getaways.',
    points: ['Flexible Travel', 'City & Outstation', 'Weekend Trips', 'Long Distance'],
    featured: true,
  },
  {
    icon: '🏍️',
    label: 'BIKE RENTAL',
    title: 'Bike Rental',
    text: 'Affordable bikes for local sightseeing, daily travel, and exploring Mathura–Vrindavan freely.',
    points: ['Daily Rental', 'Local Sightseeing', 'Short Trips', 'Easy Booking'],
  },
];

const features = [
  ['🏨', 'Hotel Stay', 'Handpicked comfortable accommodation during your journey.'],
  ['🚌', 'Safe Travel', 'Clean, well-maintained vehicles with expert local drivers.'],
  ['🍽️', 'Delicious Meals', 'Enjoy hygienic, pure vegetarian local food options.'],
  ['📸', 'Guided Sightseeing', 'Explore famous temples and spiritual landmarks smoothly.'],
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenu, setMobileMenu] = useState(false);

  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    phone: '',
    serviceType: 'Tour Package (3 Days)',
    travelDate: '',
    pickupLocation: '',
    notes: '',
  });

  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuthChange = (e) => {
    const { name, value } = e.target;

    setAuthForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetAuthForm = () => {
    setAuthForm({
      name: '',
      email: '',
      password: '',
      phone: '',
    });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const endpoint =
        authMode === 'login'
            ? `${API_BASE_URL}/api/login`
            : `${API_BASE_URL}/api/signup`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Request failed.');
        return;
      }

      if (data.success) {
        if (authMode === 'login') {
          setIsLoggedIn(true);
          setCurrentUser(data.user);
          resetAuthForm();
        } else {
          alert('Account created successfully! Please login.');
          setAuthMode('login');
          resetAuthForm();
        }
      } else {
        alert(data.message || 'Authentication failed.');
      }
    } catch (error) {
      console.error('Authentication error:', error);

      alert(
          'Unable to connect to server. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;

    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Booking request failed.');
        return;
      }

      if (data.success) {
        setBookingSubmitted(true);
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Booking error:', error);

      alert(
          'Unable to connect to server. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileMenu(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    resetAuthForm();
  };

  if (!isLoggedIn) {
    return (
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="logo-circle">🛕</div>

            <h2>Shri Mathura Tour & Travels</h2>

            <p className="auth-subtitle">
              Radhe Radhe • Please {authMode === 'login' ? 'login' : 'sign up'} to
              continue
            </p>

            <div className="auth-tabs">
              <button
                  type="button"
                  className={authMode === 'login' ? 'auth-tab active' : 'auth-tab'}
                  onClick={() => switchAuthMode('login')}
              >
                Login
              </button>

              <button
                  type="button"
                  className={authMode === 'signup' ? 'auth-tab active' : 'auth-tab'}
                  onClick={() => switchAuthMode('signup')}
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
                  disabled={loading}
              >
                {loading
                    ? 'Please wait...'
                    : authMode === 'login'
                        ? 'Login 🚀'
                        : 'Create Account 🚀'}
              </button>
            </form>

            <div className="auth-switch">
              {authMode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button type="button" onClick={() => switchAuthMode('signup')}>
                      Sign Up
                    </button>
                  </p>
              ) : (
                  <p>
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchAuthMode('login')}>
                      Login
                    </button>
                  </p>
              )}
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="website">
        <div className="topbar">
          <div>🙏 Radhe Radhe • Welcome, {currentUser?.name || 'Devotee'}</div>

          <div className="topbar-right">
            <span>📍 Mathura, U.P.</span>

            <a href="tel:+919119711375">📞 +91 91197-11375</a>

            <button
                type="button"
                onClick={() => {
                  setIsLoggedIn(false);
                  setCurrentUser(null);
                }}
                className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>

        <header className="navbar">
          <div className="nav-container">
            <button
                type="button"
                className="logo"
                onClick={() => navigateTo('home')}
            >
              <div className="logo-circle">🛕</div>

              <div className="logo-text">
                <strong>Shri Mathura</strong>
                <span>Tour & Travels</span>
              </div>
            </button>

            <nav className={mobileMenu ? 'nav-links open' : 'nav-links'}>
              <button
                  type="button"
                  className={currentPage === 'home' ? 'active-link' : ''}
                  onClick={() => navigateTo('home')}
              >
                Home
              </button>

              <button
                  type="button"
                  className={currentPage === 'tours' ? 'active-link' : ''}
                  onClick={() => navigateTo('tours')}
              >
                Tours
              </button>

              <button
                  type="button"
                  className={currentPage === 'rentals' ? 'active-link' : ''}
                  onClick={() => navigateTo('rentals')}
              >
                Rentals
              </button>

              <button
                  type="button"
                  className={
                    currentPage === 'destinations' ? 'active-link' : ''
                  }
                  onClick={() => navigateTo('destinations')}
              >
                Places
              </button>

              <button
                  type="button"
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
                  type="button"
                  className={currentPage === 'contact' ? 'active-link' : ''}
                  onClick={() => navigateTo('contact')}
              >
                Contact
              </button>
            </nav>

            <div className="nav-actions">
              <button
                  type="button"
                  className="nav-call"
                  onClick={() => navigateTo('booking')}
              >
                📅 Book Now
              </button>

              <button
                  type="button"
                  className="menu-button"
                  aria-label="Open menu"
                  onClick={() => setMobileMenu((value) => !value)}
              >
                {mobileMenu ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </header>

        <main className="main-content">
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
                          type="button"
                          onClick={() => navigateTo('tours')}
                          className="btn btn-primary"
                      >
                        Explore Tour Packages <span>→</span>
                      </button>

                      <button
                          type="button"
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
                      Explore Mathura Janmabhoomi, Banke Bihari, Prem Mandir,
                      Gokul, Govardhan, and Barsana with effortless logistics and
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
                          type="button"
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
                        <p>
                          Banke Bihari Mandir, Prem Mandir, ISKCON & Nidhivan
                        </p>
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
                          className={`rental-card ${
                              rental.featured ? 'featured' : ''
                          }`}
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
                          {rental.points.map((point) => (
                              <li key={point}>✓ {point}</li>
                          ))}
                        </ul>

                        <button
                            type="button"
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
                            type="button"
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
                              <option value="Tour Package (3 Days)">
                                Tour Package (3 Days Braj Dham - ₹5,000)
                              </option>
                              <option value="Car Rental with Driver">
                                Car Rental with Driver
                              </option>
                              <option value="Self Drive Car Rental">
                                Self Drive Car Rental
                              </option>
                              <option value="Bike Rental">Bike Rental</option>
                              <option value="Custom Tour / Outstation Cab">
                                Custom Tour / Outstation Cab
                              </option>
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
                            />
                          </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary booking-submit-btn"
                            disabled={loading}
                        >
                          {loading
                              ? 'Saving Booking...'
                              : 'Confirm Advance Booking 🚀'}
                        </button>
                      </form>
                  ) : (
                      <div className="booking-success-box">
                        <div className="success-icon">🎉</div>

                        <h3>Booking Request Saved to Database!</h3>

                        <p>
                          Thank you, <strong>{bookingForm.fullName}</strong>. Your
                          booking for <strong>{bookingForm.serviceType}</strong> has
                          been received.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                              setBookingSubmitted(false);
                              setBookingForm({
                                fullName: '',
                                phone: '',
                                serviceType: 'Tour Package (3 Days)',
                                travelDate: '',
                                pickupLocation: '',
                                notes: '',
                              });
                            }}
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

        <footer>
          <div className="footer-main">
            <div className="footer-brand">
              🛕 Shri Mathura Tour & Travels
            </div>

            <p>Your Trust • Our Respect</p>
          </div>

          <div className="footer-links">
            <button type="button" onClick={() => navigateTo('home')}>
              Home
            </button>

            <button type="button" onClick={() => navigateTo('tours')}>
              Tours
            </button>

            <button type="button" onClick={() => navigateTo('rentals')}>
              Rentals
            </button>

            <button type="button" onClick={() => navigateTo('destinations')}>
              Places
            </button>

            <button type="button" onClick={() => navigateTo('booking')}>
              Advance Booking
            </button>

            <button type="button" onClick={() => navigateTo('contact')}>
              Contact
            </button>
          </div>

          <small>
            © 2026 Shri Mathura Tour & Travels • All Rights Reserved
          </small>
        </footer>

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