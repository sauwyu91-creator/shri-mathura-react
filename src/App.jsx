
import { useState } from 'react';
import './App.css';
import poster from './assets/tour-poster.png';

function App() {
  const [showAccount, setShowAccount] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountMessage, setAccountMessage] = useState('');

  const [account, setAccount] = useState({
    fullName: '',
    mobileNumber: '',
    password: '',
    age: '',
    gender: '',
    maritalStatus: 'Unmarried',
    spouseName: '',
    marriageDate: '',
    city: '',
  });

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setAccountMessage('');

    if (Number(account.age) < 18) {
      setAccountMessage('Account creation is available for users aged 18 or above.');
      return;
    }

    if (account.maritalStatus === 'Married' &&
        (!account.spouseName.trim() || !account.marriageDate)) {
      setAccountMessage('Please enter spouse name and marriage date.');
      return;
    }

    setAccountLoading(true);

    try {
      const response = await fetch('https://your-backend-url.onrender.com/api/auth/register',  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create account.');
      }

      setAccountMessage('Account created successfully! 🙏');
      setAccount({
        fullName: '',
        mobileNumber: '',
        password: '',
        age: '',
        gender: '',
        maritalStatus: 'Unmarried',
        spouseName: '',
        marriageDate: '',
        city: '',
      });
    } catch (error) {
      setAccountMessage(error.message || 'Something went wrong.');
    } finally {
      setAccountLoading(false);
    }
  };

  const destinations = [
    {
      icon: '🛕',
      name: 'Shri Krishna Janmabhoomi',
      text: 'Experience the sacred birthplace of Lord Krishna.',
    },
    {
      icon: '🙏',
      name: 'Banke Bihari Mandir',
      text: 'Seek divine blessings in the heart of Vrindavan.',
    },
    {
      icon: '✨',
      name: 'Prem Mandir',
      text: 'Witness beautiful lights and divine architecture.',
    },
    {
      icon: '🌸',
      name: 'ISKCON Temple',
      text: 'Feel the peaceful spiritual atmosphere of Vrindavan.',
    },
    {
      icon: '🐄',
      name: 'Gokul',
      text: 'Explore the beautiful childhood memories of Krishna.',
    },
    {
      icon: '⛰️',
      name: 'Govardhan',
      text: 'Visit the sacred Govardhan Parvat and surroundings.',
    },
    {
      icon: '🌺',
      name: 'Barsana',
      text: 'Discover the divine land of Radha Rani.',
    },
  ];

  const features = [
    {
      icon: '🏨',
      title: 'Hotel Stay',
      text: 'Comfortable accommodation during your journey.',
    },
    {
      icon: '🚌',
      title: 'Comfortable Travel',
      text: 'Safe and convenient transportation for your trip.',
    },
    {
      icon: '🍽️',
      title: 'Delicious Meals',
      text: 'Enjoy tasty meals during your tour package.',
    },
    {
      icon: '📸',
      title: 'Sightseeing',
      text: 'Explore famous temples and spiritual destinations.',
    },
  ];

  const rentals = [
    {
      icon: '🚗',
      label: 'WITH DRIVER',
      title: 'Car Rental',
      text: 'Comfortable cars with experienced drivers for local sightseeing, airport transfers, outstation trips and family travel.',
      points: [
        'Local & Outstation',
        'Airport Transfer',
        'Family Trips',
        'All India Travel',
      ],
      message: 'Hello, I want to enquire about Car Rental with Driver.',
    },
    {
      icon: '🚘',
      label: 'SELF DRIVE',
      title: 'Self Drive Car',
      text: 'Enjoy the freedom of driving your own rental car for city trips, road trips, weekend travel and long-distance journeys.',
      points: [
        'Flexible Travel',
        'City & Outstation',
        'Weekend Trips',
        'Long Distance Travel',
      ],
      message: 'Hello, I want to enquire about Self Drive Car Rental.',
      featured: true,
    },
    {
      icon: '🏍️',
      label: 'BIKE RENTAL',
      title: 'Bike Rental',
      text: 'Affordable bikes for local sightseeing, daily travel, short trips and exploring Mathura–Vrindavan.',
      points: [
        'Daily Rental',
        'Local Sightseeing',
        'Short Trips',
        'Easy Booking',
      ],
      message: 'Hello, I want to enquire about Bike Rental.',
    },
  ];

  return (
    <div className="website">
      {/* ================= TOP BAR ================= */}

      <div className="topbar">
        <div>🙏 Radhe Radhe • Chalo Braj Dham</div>

        <div className="top-contact">📞 9119711375</div>
      </div>

      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="nav-container">
          <a href="#home" className="logo">
            <div className="logo-circle">🛕</div>

            <div className="logo-text">
              <h2>Shri Mathura</h2>
              <span>Tour & Travels</span>
            </div>
          </a>

          <nav>
            <a href="#home">Home</a>
            <a href="#package">Tours</a>
            <a href="#rental">Rentals</a>
            <a href="#destinations">Places</a>
            <a href="#about">Why Us</a>
            <a href="#contact">Contact</a>
          </nav>

          <button
            type="button"
            className="nav-account"
            onClick={() => {
              setAccountMessage('');
              setShowAccount(true);
            }}
          >
            Create Account
          </button>

          <a href="tel:+919119711375" className="nav-call">
            📞 Call Now
          </a>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-tag">✨ SPIRITUAL JOURNEY WITH DIVINE VIBES</div>

          <h1>
            Discover the
            <span> Divine Beauty </span>
            of Braj Dham
          </h1>

          <p className="hero-description">
            Experience the sacred beauty of Mathura and Vrindavan with
            comfortable travel, memorable tours, car rentals, self-drive cars
            and bike rentals.
          </p>

          <div className="hero-price">
            <div>
              <small>3 DAYS TOUR PACKAGE</small>

              <strong>₹5,000</strong>

              <span>Per Person</span>
            </div>

            <div className="price-line"></div>

            <div className="hero-mini">
              <span>✓ Hotel Stay</span>
              <span>✓ Meals</span>
              <span>✓ Travel</span>
              <span>✓ Sightseeing</span>
            </div>
          </div>

          <div className="hero-buttons">
            <a href="#package" className="primary-btn">
              Explore Tour →
            </a>

            <a href="#rental" className="outline-btn">
              🚗 Rent a Vehicle
            </a>

            <a
              href="https://wa.me/919119711375"
              target="_blank"
              rel="noreferrer"
              className="whatsapp-btn"
            >
              💬 WhatsApp
            </a>
          </div>

          <div className="trust-row">
            <span>✓ Family Friendly</span>
            <span>✓ Group Tours</span>
            <span>✓ Vehicle Rental</span>
            <span>✓ All India Travel</span>
          </div>
        </div>

        {/* HERO IMAGE */}

        <div className="hero-image-wrapper">
          <div className="hero-image">
            <img src={poster} alt="Shri Mathura Tour and Travels" />
          </div>

          <div className="floating-card">
            <div className="floating-icon">🙏</div>

            <div>
              <strong>Chalo Braj Dham</strong>

              <small>Divine • Peaceful • Memorable</small>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK INFO ================= */}

      <section className="quick-info">
        <div className="quick-card">
          <div>🛕</div>
          <span>7+</span>
          <p>Spiritual Places</p>
        </div>

        <div className="quick-card">
          <div>🚗</div>
          <span>Car</span>
          <p>Rental Service</p>
        </div>

        <div className="quick-card">
          <div>🏍️</div>
          <span>Bike</span>
          <p>Rental Service</p>
        </div>

        <div className="quick-card">
          <div>🇮🇳</div>
          <span>All India</span>
          <p>Travel Service</p>
        </div>
      </section>

      {/* ================= TOUR PACKAGE ================= */}

      <section className="package-section" id="package">
        <div className="section-heading">
          <span>OUR FEATURED TOUR</span>

          <h2>
            3 Days Mathura – Vrindavan
            <br />
            <em>Spiritual Tour</em>
          </h2>

          <p>A beautiful journey through the sacred places of Braj Dham.</p>
        </div>

        <div className="package-container">
          <div className="package-image">
            <img src={poster} alt="Mathura Vrindavan Tour" />

            <div className="image-badge">⭐ Special Package</div>
          </div>

          <div className="package-content">
            <div className="package-label">3 DAYS • MATHURA – VRINDAVAN</div>

            <h3>
              Complete Braj Dham
              <br />
              <span>Experience</span>
            </h3>

            <p>
              Explore Mathura, Vrindavan, Gokul, Govardhan and Barsana with
              comfortable travel and spiritual sightseeing.
            </p>

            <div className="package-price">
              <span>Starting from</span>

              <strong>₹5,000</strong>

              <small>Per Person</small>
            </div>

            <div className="included-list">
              <div>✓ Hotel Stay</div>
              <div>✓ Delicious Meals</div>
              <div>✓ Comfortable Travel</div>
              <div>✓ Temple Darshan</div>
              <div>✓ Sightseeing</div>
              <div>✓ Family & Group Friendly</div>
            </div>

            <a href="tel:+919119711375" className="book-btn">
              📞 Book / Enquire Now
            </a>
          </div>
        </div>
      </section>

      {/* ================= RENTAL SERVICES ================= */}

      <section className="rental-section" id="rental">
        <div className="section-heading">
          <span>TRAVEL & RENTAL SERVICES</span>

          <h2>
            Rent. Ride.
            <br />
            <em>Explore India.</em>
          </h2>

          <p>
            Choose from cars, self-drive vehicles and bikes for local travel,
            outstation trips and journeys across India.
          </p>
        </div>

        <div className="rental-grid">
          {rentals.map((rental) => (
            <div
              className={`rental-card ${
  rental.featured ? 'featured-rental' : ''
}`}
              key={rental.title}
            >
              {rental.featured && (
                <div className="popular-badge">⭐ POPULAR</div>
              )}

              <div className="rental-icon">{rental.icon}</div>

              <span className="rental-label">{rental.label}</span>

              <h3>{rental.title}</h3>

              <p>{rental.text}</p>

              <ul>
                {rental.points.map((point) => (
                  <li key={point}>✓ {point}</li>
                ))}
              </ul>

              <a
                href={`https://wa.me/919119711375?text=${encodeURIComponent(
  rental.message,
)}`}
                target="_blank"
                rel="noreferrer"
                className="rental-btn"
              >
                Enquire on WhatsApp →
              </a>
            </div>
          ))}
        </div>

        {/* ALL INDIA */}

        <div className="all-india">
          <div className="india-icon">🇮🇳</div>

          <div className="india-content">
            <span>TRAVEL ACROSS INDIA</span>

            <h3>All India Tour & Travel Services</h3>

            <p>
              Local Trips • Outstation • Intercity Travel • Airport Transfers •
              Road Trips • Vehicle Rental
            </p>
          </div>

          <a href="tel:+919119711375" className="india-btn">
            📞 Call Now
          </a>
        </div>
      </section>

      {/* ================= DESTINATIONS ================= */}

      <section className="destinations-section" id="destinations">
        <div className="section-heading">
          <span>EXPLORE BRAJ DHAM</span>

          <h2>
            Sacred Places
            <br />
            <em>We Cover</em>
          </h2>

          <p>Visit the most loved spiritual destinations of Braj.</p>
        </div>

        <div className="destination-grid">
          {destinations.map((place) => (
            <div className="destination-card" key={place.name}>
              <div className="destination-icon">{place.icon}</div>

              <h3>{place.name}</h3>

              <p>{place.text}</p>

              <a href="#contact">Enquire →</a>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY US ================= */}

      <section className="why-section" id="about">
        <div className="section-heading">
          <span>WHY TRAVEL WITH US</span>

          <h2>
            Your Comfort,
            <br />
            <em>Our Responsibility</em>
          </h2>

          <p>
            We aim to make your Braj Yatra and travel experience comfortable and
            memorable.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SERVICES STRIP ================= */}

      <section className="service-strip">
        <div>
          🚗
          <span>Car Rental</span>
        </div>

        <div>
          🚘
          <span>Self Drive</span>
        </div>

        <div>
          🏍️
          <span>Bike Rental</span>
        </div>

        <div>
          🚌
          <span>Tour Packages</span>
        </div>

        <div>
          🇮🇳
          <span>All India Travel</span>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="cta-section">
        <div className="cta-content">
          <span>🙏 RADHE RADHE</span>

          <h2>
            Ready to Explore
            <br />
            <em>Braj Dham?</em>
          </h2>

          <p>Book a tour, rent a vehicle or plan your next journey with us.</p>

          <div className="cta-buttons">
            <a href="tel:+919119711375" className="cta-call">
              📞 Call 9119711375
            </a>

            <a
              href="https://wa.me/919119711375"
              target="_blank"
              rel="noreferrer"
              className="cta-whatsapp"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}

      <section className="contact-section" id="contact">
        <div className="contact-box">
          <div>
            <span>CONTACT US</span>

            <h2>
              Shri Mathura
              <br />
              Tour & Travels
            </h2>

            <p>Your Trust • Our Respect</p>
          </div>

          <div className="contact-details">
            <a href="tel:+919119711375">
              📞 <strong>9119711375</strong>
            </a>

            <p>
              📍 57, Hanuman Nagar,
              <br />
              Dholi Pyau, Mathura (U.P.)
            </p>

            <p>📸 @shri_mathura_tour_travels</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer>
        <div className="footer-logo">🛕 Shri Mathura Tour & Travels</div>

        <p>Your Trust • Our Respect</p>

        <div className="footer-links">
          <a href="#home">Home</a>

          <a href="#package">Tours</a>

          <a href="#rental">Rentals</a>

          <a href="#destinations">Destinations</a>

          <a href="#contact">Contact</a>
        </div>

        <small>© 2026 Shri Mathura Tour & Travels • All Rights Reserved</small>
      </footer>

      {/* ================= FLOATING WHATSAPP ================= */}

      <a
        href="https://wa.me/919119711375"
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp"
      >
        💬
      </a>

      {/* ================= CREATE ACCOUNT MODAL ================= */}
      {showAccount && (
        <div className="account-overlay" onClick={() => setShowAccount(false)}>
          <div
            className="account-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="account-close"
              onClick={() => setShowAccount(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="account-header">
              <span>🙏 SHRI MATHURA</span>
              <h2>Create Account</h2>
              <p>Join us and plan your Braj Dham journey.</p>
            </div>

            <form className="account-form" onSubmit={handleCreateAccount}>
              <div className="account-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    name="fullName"
                    value={account.fullName}
                    onChange={handleAccountChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    name="mobileNumber"
                    value={account.mobileNumber}
                    onChange={handleAccountChange}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    maxLength="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={account.password}
                    onChange={handleAccountChange}
                    placeholder="Minimum 8 characters"
                    minLength="8"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={account.age}
                    onChange={handleAccountChange}
                    placeholder="18+"
                    min="18"
                    max="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    name="gender"
                    value={account.gender}
                    onChange={handleAccountChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Marital Status *</label>
                  <select
                    name="maritalStatus"
                    value={account.maritalStatus}
                    onChange={handleAccountChange}
                    required
                  >
                    <option value="Unmarried">Unmarried</option>
                    <option value="Married">Married</option>
                  </select>
                </div>

                {account.maritalStatus === 'Married' && (
                  <>
                    <div className="form-group">
                      <label>Spouse Name *</label>
                      <input
                        name="spouseName"
                        value={account.spouseName}
                        onChange={handleAccountChange}
                        placeholder="Enter spouse name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Marriage Date *</label>
                      <input
                        type="date"
                        name="marriageDate"
                        value={account.marriageDate}
                        onChange={handleAccountChange}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="form-group account-full">
                  <label>City *</label>
                  <input
                    name="city"
                    value={account.city}
                    onChange={handleAccountChange}
                    placeholder="Enter your city"
                    required
                  />
                </div>
              </div>

              {accountMessage && (
                <div className={`account-message ${
  accountMessage.includes('successfully') ? 'success' : 'error'
}`}>
                  {accountMessage}
                </div>
              )}

              <button
                type="submit"
                className="account-submit"
                disabled={accountLoading}
              >
                {accountLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

