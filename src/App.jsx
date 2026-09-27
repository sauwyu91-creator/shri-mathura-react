import { useEffect, useState } from 'react';
import './App.css';
import poster from './assets/tour-poster.png';

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
  { icon: '🚗', label: 'WITH DRIVER', title: 'Car Rental', text: 'Comfortable cars with experienced drivers for local sightseeing, airport transfers, and outstation family trips.', points: ['Local & Outstation', 'Airport Transfer', 'Family Trips', 'All India Travel'] },
  { icon: '🚘', label: 'SELF DRIVE', title: 'Self Drive Car', text: 'Enjoy the freedom of driving your own rental car for city trips, road trips, and weekend getaways.', points: ['Flexible Travel', 'City & Outstation', 'Weekend Trips', 'Long Distance'], featured: true },
  { icon: '🏍️', label: 'BIKE RENTAL', title: 'Bike Rental', text: 'Affordable bikes for local sightseeing, daily travel, and exploring Mathura–Vrindavan freely.', points: ['Daily Rental', 'Local Sightseeing', 'Short Trips', 'Easy Booking'] },
];

const features = [
  ['🏨', 'Hotel Stay', 'Handpicked comfortable accommodation during your journey.'],
  ['🚌', 'Safe Travel', 'Clean, well-maintained vehicles with expert local drivers.'],
  ['🍽️', 'Delicious Meals', 'Enjoy hygienic, pure vegetarian local food options.'],
  ['📸', 'Guided Sightseeing', 'Explore famous temples and spiritual landmarks smoothly.'],
];

const faqs = [
  ['Can I book a tour in advance?', 'Yes. Use the Advance Booking section and submit your travel details.'],
  ['Do you provide vehicle rentals?', 'Yes. We offer car with driver, self-drive car and bike rental options.'],
  ['Can I request a custom tour?', 'Yes. Select Custom Tour / Outstation Cab and mention your requirements in notes.'],
  ['How will I know my booking status?', 'After login, open My Bookings to see your booking and its current status.'],
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [bookingForm, setBookingForm] = useState({
    fullName: '', phone: '', serviceType: 'Tour Package (3 Days)',
    travelDate: '', pickupLocation: '', notes: '',
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [lastBookingId, setLastBookingId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 450);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  useEffect(() => {
    const savedUser = localStorage.getItem('shriMathuraUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem('shriMathuraUser');
      }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUser?.id) fetchBookings();
  }, [isLoggedIn, currentUser?.id]);

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetAuthForm = () => setAuthForm({ name: '', email: '', password: '', phone: '' });

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const endpoint = authMode === 'login'
        ? `${API_BASE_URL}/api/login`
        : `${API_BASE_URL}/api/signup`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const data = await response.json();

      if (!response.ok) return alert(data.message || 'Request failed.');

      if (data.success) {
        if (authMode === 'login') {
          setIsLoggedIn(true);
          setCurrentUser(data.user);
          localStorage.setItem('shriMathuraUser', JSON.stringify(data.user));
          setBookingForm((prev) => ({
            ...prev,
            fullName: data.user.name || '',
            phone: data.user.phone || '',
          }));
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
      console.error(error);
      alert('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setBookings([]);
    localStorage.removeItem('shriMathuraUser');
    setCurrentPage('home');
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchBookings = async () => {
    if (!currentUser?.id) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/user/${currentUser.id}`);
      const data = await response.json();
      if (response.ok && data.success) setBookings(data.bookings || []);
    } catch (error) {
      console.error('Booking history error:', error);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bookingForm, userId: currentUser?.id || null }),
      });
      const data = await response.json();

      if (!response.ok) return alert(data.message || 'Booking request failed.');

      if (data.success) {
        setLastBookingId(data.bookingId);
        setBookingSubmitted(true);
        await fetchBookings();
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      alert('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setBookingSubmitted(false);
    setLastBookingId(null);
    setBookingForm({
      fullName: currentUser?.name || '',
      phone: currentUser?.phone || '',
      serviceType: 'Tour Package (3 Days)',
      travelDate: '',
      pickupLocation: '',
      notes: '',
    });
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              Radhe Radhe • Please {authMode === 'login' ? 'login' : 'sign up'} to continue
            </p>

            <div className="auth-tabs">
              <button type="button" className={authMode === 'login' ? 'auth-tab active' : 'auth-tab'} onClick={() => switchAuthMode('login')}>Login</button>
              <button type="button" className={authMode === 'signup' ? 'auth-tab active' : 'auth-tab'} onClick={() => switchAuthMode('signup')}>Create Account</button>
            </div>

            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authMode === 'signup' && (
                  <label>Full Name *<input type="text" name="name" value={authForm.name} onChange={handleAuthChange} required /></label>
              )}
              <label>Email Address *<input type="email" name="email" value={authForm.email} onChange={handleAuthChange} required /></label>
              <label>Password *<input type="password" name="password" value={authForm.password} onChange={handleAuthChange} required /></label>
              {authMode === 'signup' && (
                  <label>Mobile Number<input type="tel" name="phone" value={authForm.phone} onChange={handleAuthChange} /></label>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Please wait...' : authMode === 'login' ? 'Login 🚀' : 'Create Account 🚀'}
              </button>
            </form>

            <div className="auth-switch">
              {authMode === 'login'
                  ? <p>Don't have an account? <button type="button" onClick={() => switchAuthMode('signup')}>Sign Up</button></p>
                  : <p>Already have an account? <button type="button" onClick={() => switchAuthMode('login')}>Login</button></p>}
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
            <button type="button" onClick={() => navigateTo('dashboard')} className="logout-btn">👤 Dashboard</button>
            <button type="button" onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>

        <header className="navbar">
          <div className="nav-container">
            <button type="button" className="logo" onClick={() => navigateTo('home')}>
              <div className="logo-circle">🛕</div>
              <div className="logo-text"><strong>Shri Mathura</strong><span>Tour & Travels</span></div>
            </button>

            <nav className={mobileMenu ? 'nav-links open' : 'nav-links'}>
              {[
                ['home', 'Home'], ['tours', 'Tours'], ['rentals', 'Rentals'],
                ['destinations', 'Places'], ['booking', '📅 Advance Booking'],
                ['bookings', '📋 My Bookings'], ['contact', 'Contact'],
              ].map(([page, label]) => (
                  <button key={page} type="button" className={currentPage === page ? 'active-link' : ''} onClick={() => navigateTo(page)}>{label}</button>
              ))}
            </nav>

            <div className="nav-actions">
              <button type="button" className="nav-call" onClick={() => navigateTo('booking')}>📅 Book Now</button>
              <button type="button" className="menu-button" onClick={() => setMobileMenu((v) => !v)}>{mobileMenu ? '✕' : '☰'}</button>
            </div>
          </div>
        </header>

        <main className="main-content">
          {currentPage === 'home' && (
              <div className="page-fade">
                <section className="hero">
                  <div className="hero-content">
                    <div className="eyebrow">✨ SPIRITUAL JOURNEY WITH DIVINE VIBES</div>
                    <h1>Discover the <span>Divine Beauty</span> of Braj Dham</h1>
                    <p className="hero-description">Experience Mathura, Vrindavan, and all of India with comfortable tour packages, car rentals, self-drive cars, and bike rentals tailored for your peace of mind.</p>
                    <div className="hero-price-card">
                      <div><small>3 DAYS TOUR PACKAGE</small><strong>₹5,000</strong><span>Starting price • Per Person</span></div>
                      <div className="hero-checks"><span>✓ Hotel Stay</span><span>✓ Meals</span><span>✓ Travel</span><span>✓ Sightseeing</span></div>
                    </div>
                    <div className="hero-buttons">
                      <button type="button" onClick={() => navigateTo('tours')} className="btn btn-primary">Explore Tour Packages →</button>
                      <button type="button" onClick={() => navigateTo('booking')} className="btn btn-outline">📅 Advance Booking</button>
                      <a href="https://wa.me/919119711375" target="_blank" rel="noreferrer" className="btn btn-whatsapp">💬 WhatsApp Chat</a>
                    </div>
                    <div className="trust-row"><span>⭐ 100% Trusted Agency</span><span>🛡️ Family Friendly</span><span>🇮🇳 All India Service</span></div>
                  </div>

                  <div className="hero-visual">
                    <div className="poster-frame"><img src={poster} alt="Shri Mathura Tour and Travels poster" /><div className="poster-glow" /></div>
                    <div className="hero-floating-card"><span className="floating-icon">🙏</span><div><strong>Chalo Braj Dham</strong><small>Divine • Peaceful • Memorable</small></div></div>
                  </div>
                </section>

                <section className="stats">
                  <div><b>7+</b><span>Sacred Destinations</span></div>
                  <div><b>3</b><span>Rental Categories</span></div>
                  <div><b>3 Days</b><span>Signature Tour</span></div>
                  <div><b>24/7</b><span>Customer Support</span></div>
                </section>

                <section className="section">
                  <div className="section-heading"><div className="eyebrow">WHY TRAVEL WITH US</div><h2>Your Comfort, <em>Our Priority</em></h2><p>We take care of every detail so you can focus completely on your spiritual journey.</p></div>
                  <div className="features-grid">{features.map(([icon, title, text]) => <article className="feature-card" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}</div>
                </section>

                <section className="section">
                  <div className="section-heading"><div className="eyebrow">CUSTOMER EXPERIENCE</div><h2>Everything You Need, <em>In One Place</em></h2></div>
                  <div className="upgrade-grid">
                    {[
                      ['📋', 'Track Bookings', 'Check your booking history and current status anytime.'],
                      ['🚗', 'Travel & Rentals', 'Choose tours, cars and bikes from one website.'],
                      ['⭐', 'Simple Service', 'Easy enquiry, booking and direct contact options.'],
                      ['📱', 'Mobile Friendly', 'Use the complete website comfortably on your phone.'],
                    ].map(([icon, title, text]) => <article className="feature-card" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}
                  </div>
                </section>
              </div>
          )}

          {currentPage === 'dashboard' && (
              <section className="page-fade section">
                <div className="section-heading"><div className="eyebrow">MY ACCOUNT</div><h2>Welcome, <em>{currentUser?.name || 'Traveller'}</em></h2><p>Manage your profile and travel bookings from one place.</p></div>
                <div className="dashboard-grid">
                  <article className="dashboard-card"><span>👤</span><h3>Profile</h3><p><b>Name:</b> {currentUser?.name}</p><p><b>Email:</b> {currentUser?.email}</p><p><b>Phone:</b> {currentUser?.phone || 'Not added'}</p></article>
                  <article className="dashboard-card"><span>📋</span><h3>Total Bookings</h3><strong className="big-number">{bookings.length}</strong><button className="btn btn-primary" onClick={() => navigateTo('bookings')}>View Bookings</button></article>
                  <article className="dashboard-card"><span>📅</span><h3>New Booking</h3><p>Reserve your tour or vehicle in advance.</p><button className="btn btn-primary" onClick={() => navigateTo('booking')}>Book Now</button></article>
                </div>
              </section>
          )}

          {currentPage === 'bookings' && (
              <section className="page-fade section">
                <div className="section-heading"><div className="eyebrow">MY TRAVEL RECORD</div><h2>Booking <em>History</em></h2><p>All bookings submitted from your account.</p></div>
                {bookings.length === 0 ? (
                    <div className="empty-state"><div>📭</div><h3>No bookings yet</h3><p>Your booking requests will appear here.</p><button className="btn btn-primary" onClick={() => navigateTo('booking')}>Make First Booking</button></div>
                ) : (
                    <div className="booking-history-grid">
                      {bookings.map((booking) => (
                          <article className="booking-history-card" key={booking.id}>
                            <div className="booking-card-head"><span>Booking #{booking.id}</span><StatusBadge status={booking.status} /></div>
                            <h3>{booking.service_type}</h3>
                            <p>📅 <b>Date:</b> {formatDate(booking.travel_date)}</p>
                            <p>📍 <b>Pickup:</b> {booking.pickup_location}</p>
                            <p>📞 <b>Phone:</b> {booking.phone}</p>
                            {booking.notes && <p>📝 <b>Notes:</b> {booking.notes}</p>}
                            <small>Created: {formatDateTime(booking.created_at)}</small>
                          </article>
                      ))}
                    </div>
                )}
              </section>
          )}

          {currentPage === 'tours' && (
              <section className="page-fade section">
                <div className="section-heading"><div className="eyebrow">OUR SIGNATURE TOUR</div><h2>3 Days Mathura – Vrindavan <em>Spiritual Tour</em></h2><p>Immerse yourself in the divine aura and rich heritage of Braj Dham.</p></div>
                <div className="package-card">
                  <div className="package-copy">
                    <div className="pill">3 DAYS • MATHURA – VRINDAVAN – BARSANA</div>
                    <h3>Complete Braj Dham <em>Experience</em></h3>
                    <p>Explore Mathura Janmabhoomi, Banke Bihari, Prem Mandir, Gokul, Govardhan, and Barsana with effortless logistics and comfortable travel.</p>
                    <div className="package-price"><span>Special package starting from</span><b>₹5,000</b><small>Per Person</small></div>
                    <div className="included-list"><span>✓ Comfortable Hotel Stay</span><span>✓ Hygienic Meals</span><span>✓ Safe AC/Non-AC Travel</span><span>✓ Dedicated Temple Darshan</span><span>✓ Expert Local Guide</span><span>✓ Family & Group Friendly</span></div>
                    <div className="package-actions"><button type="button" onClick={() => navigateTo('booking')} className="btn btn-primary">📅 Book This Tour</button><a href="https://wa.me/919119711375" target="_blank" rel="noreferrer" className="btn btn-whatsapp">💬 Enquire on WhatsApp</a></div>
                  </div>
                  <div className="itinerary">
                    <div className="itinerary-title">YOUR ITINERARY OVERVIEW</div>
                    <div className="timeline-item"><span>01</span><div><b>Mathura Day</b><p>Shri Krishna Janmabhoomi, Dwarkadhish Temple & Yamuna Ghats</p></div></div>
                    <div className="timeline-item"><span>02</span><div><b>Vrindavan Day</b><p>Banke Bihari Mandir, Prem Mandir, ISKCON & Nidhivan</p></div></div>
                    <div className="timeline-item"><span>03</span><div><b>Braj Circuit</b><p>Gokul childhood sites, Govardhan Parvat & Barsana Radha Rani Temple</p></div></div>
                    <div className="mini-note">🙏 Customizable itineraries available upon request for families & groups.</div>
                  </div>
                </div>
              </section>
          )}

          {currentPage === 'rentals' && (
              <section className="page-fade section">
                <div className="section-heading"><div className="eyebrow">FLEXIBLE TRANSPORTATION</div><h2>Rent. Ride. <em>Explore India.</em></h2><p>Choose clean, reliable vehicles for your local sightseeing or pan-India journeys.</p></div>
                <div className="rental-grid">{rentals.map((rental) => <article className={`rental-card ${rental.featured ? 'featured' : ''}`} key={rental.title}>{rental.featured && <div className="popular">⭐ MOST POPULAR</div>}<div className="service-icon">{rental.icon}</div><div className="service-label">{rental.label}</div><h3>{rental.title}</h3><p>{rental.text}</p><ul>{rental.points.map((point) => <li key={point}>✓ {point}</li>)}</ul><button type="button" onClick={() => navigateTo('booking')} className="service-button">Book Advance Ride →</button></article>)}</div>
              </section>
          )}

          {currentPage === 'destinations' && (
              <section className="page-fade section">
                <div className="section-heading"><div className="eyebrow">SACRED SITES</div><h2>Places You Will <em>Explore</em></h2><p>Discover the divine landmarks of Braj Dham with us.</p></div>
                <div className="destination-grid">{destinations.map(([icon, name, text]) => <article className="destination-card" key={name}><div className="destination-icon">{icon}</div><h3>{name}</h3><p>{text}</p><button type="button" onClick={() => navigateTo('booking')} className="destination-link-btn">Book Visit →</button></article>)}</div>
              </section>
          )}

          {currentPage === 'booking' && (
              <section className="page-fade section">
                <div className="section-heading"><div className="eyebrow">RESERVE IN ADVANCE</div><h2>Online <em>Advance Booking</em></h2><p>Secure your tour package or vehicle rental ahead of time for a seamless journey.</p></div>
                <div className="booking-card-wrapper">
                  {!bookingSubmitted ? (
                      <form className="booking-form" onSubmit={handleBookingSubmit}>
                        <div className="form-grid">
                          <label>Full Name *<input type="text" name="fullName" value={bookingForm.fullName} onChange={handleBookingChange} required /></label>
                          <label>Mobile Number (WhatsApp) *<input type="tel" name="phone" value={bookingForm.phone} onChange={handleBookingChange} pattern="[6-9][0-9]{9}" maxLength="10" required /></label>
                          <label>Select Service *<select name="serviceType" value={bookingForm.serviceType} onChange={handleBookingChange} required><option>Tour Package (3 Days)</option><option>Car Rental with Driver</option><option>Self Drive Car Rental</option><option>Bike Rental</option><option>Custom Tour / Outstation Cab</option></select></label>
                          <label>Travel / Booking Date *<input type="date" name="travelDate" value={bookingForm.travelDate} onChange={handleBookingChange} required /></label>
                          <label className="form-full">Pickup Location / City *<input type="text" name="pickupLocation" value={bookingForm.pickupLocation} onChange={handleBookingChange} required /></label>
                          <label className="form-full">Special Requests / Notes<textarea name="notes" value={bookingForm.notes} onChange={handleBookingChange} rows="3" /></label>
                        </div>
                        <button type="submit" className="btn btn-primary booking-submit-btn" disabled={loading}>{loading ? 'Saving Booking...' : 'Confirm Advance Booking 🚀'}</button>
                      </form>
                  ) : (
                      <div className="booking-success-box">
                        <div className="success-icon">🎉</div>
                        <h3>Booking Request Saved!</h3>
                        <p>Thank you, <strong>{bookingForm.fullName}</strong>. Your booking has been received.</p>
                        <p className="booking-id">Booking ID: <strong>#{lastBookingId}</strong> • Status: <strong>Pending</strong></p>
                        <div className="package-actions"><button type="button" onClick={() => navigateTo('bookings')} className="btn btn-primary">📋 View My Bookings</button><button type="button" onClick={resetBooking} className="btn btn-outline">Make Another Booking</button></div>
                      </div>
                  )}
                </div>
              </section>
          )}

          {currentPage === 'contact' && (
              <section className="page-fade section">
                <div className="contact-card page-contact"><div><div className="eyebrow">GET IN TOUCH</div><h2>Shri Mathura<br />Tour & Travels</h2><p>Your Trust • Our Respect</p></div><div className="contact-details"><a href="tel:+919119711375">📞 <strong>+91 91197-11375</strong></a><p>📍 57, Hanuman Nagar,<br />Dholi Pyau, Mathura (U.P.)</p></div><div className="contact-actions"><a className="btn btn-primary" href="tel:+919119711375">Call Now</a><a className="btn btn-whatsapp" href="https://wa.me/919119711375" target="_blank" rel="noreferrer">WhatsApp Us</a></div></div>
                <section className="faq-section"><div className="section-heading"><div className="eyebrow">HELP CENTER</div><h2>Frequently Asked <em>Questions</em></h2></div>{faqs.map(([q, a], i) => <div className="faq-item" key={q}><button type="button" onClick={() => setFaqOpen(faqOpen === i ? null : i)}><span>{q}</span><b>{faqOpen === i ? '−' : '+'}</b></button>{faqOpen === i && <p>{a}</p>}</div>)}</section>
              </section>
          )}
        </main>

        <footer>
          <div className="footer-main"><div className="footer-brand">🛕 Shri Mathura Tour & Travels</div><p>Your Trust • Our Respect</p></div>
          <div className="footer-links">{[['home','Home'],['tours','Tours'],['rentals','Rentals'],['destinations','Places'],['booking','Advance Booking'],['bookings','My Bookings'],['contact','Contact']].map(([p,l]) => <button key={p} type="button" onClick={() => navigateTo(p)}>{l}</button>)}</div>
          <small>© 2026 Shri Mathura Tour & Travels • All Rights Reserved</small>
        </footer>

        {showScrollTop && (
        <button
          type="button"
          className="scroll-top"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      )}

      <a className="floating-whatsapp" href="https://wa.me/919119711375" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">💬</a>
      </div>
  );
}

function StatusBadge({ status }) {
  const value = status || 'Pending';
  return <span className={`status-badge status-${value.toLowerCase()}`}>{value}</span>;
}

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-IN');
}

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString('en-IN');
}

export default App;

