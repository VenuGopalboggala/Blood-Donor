import React, { useEffect, useState } from "react";
import axios from "axios";
import "./donorDashboard.css";

const API_BASE_URL = "https://blood-donor-jkjv.onrender.com";

export default function DonorDashboard() {
  const donorId = localStorage.getItem("userId");
  const [view, setView] = useState("dashboard"); // 'dashboard' or 'profile'
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchBlood, setSearchBlood] = useState("");
  const [donorData, setDonorData] = useState(null);

  // Form states for Availability Offer
  const [donorName, setDonorName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState("");
  const [availableDate, setAvailableDate] = useState("");
  const [message, setMessage] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Load Requests
      const res = await axios.get(`${API_BASE_URL}/api/blood-request/donor/${donorId}`);
      setRequests(res.data);
      setFilteredRequests(res.data);

      // Load Donor Profile
      const profileRes = await axios.get(`${API_BASE_URL}/api/donors/${donorId}`);
      setDonorData(profileRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }

  // CONTRIBUTION TRACKER: Count accepted requests
  const livesSavedCount = requests.filter(req => req.status === 'accepted').length;

  async function handlePostOffer(e) {
    e.preventDefault();
    setIsPosting(true);
    try {
      const payload = { donorId: parseInt(donorId), donorName, contactPhone, location, availabilityDate: availableDate, message };
      await axios.post(`${API_BASE_URL}/api/donor-offer`, payload);
      alert("✅ Success! Your availability is now visible.");
      setDonorName(""); setContactPhone(""); setLocation(""); setAvailableDate(""); setMessage("");
    } catch (err) {
      alert("❌ Post Failed.");
    } finally {
      setIsPosting(false);
    }
  }

  // Add this state at the top with your others
const [showThankYou, setShowThankYou] = useState(false);

async function accept(id) {
  try {
    await axios.put(`${API_BASE_URL}/api/blood-request/accept/${id}`);
    
    // Trigger the unique "Nice Way" message instead of an alert
    setShowThankYou(true);
    
    // Auto-hide after 3 seconds or let them click close
    setTimeout(() => setShowThankYou(false), 4000);
    
    loadData(); 
  } catch (err) {
    console.error("Accept error:", err);
  }
}

  async function reject(id) {
    try {
      await axios.put(`${API_BASE_URL}/api/blood-request/reject/${id}`);
      loadData();
    } catch (err) { console.error(err); }
  }
  
  // ... inside your DonorDashboard component
const [donorProfile, setDonorProfile] = useState(null);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const storedId = localStorage.getItem("userId");
      if (storedId) {
        // This must match your backend route for getting a single donor's info
        const res = await axios.get(`${API_BASE_URL}/api/donors/${storedId}`);
        setDonorProfile(res.data);
      }
    } catch (err) {
      console.error("Error fetching profile details:", err);
    }
  };

  fetchProfile();
}, []);

  function filterBloodType(type) {
    setSearchBlood(type);
    setFilteredRequests(type === "" ? requests : requests.filter((req) => req.bloodType === type));
  }

  return (
    <div className="donor-app-container">
      {/* SIDEBAR NAVIGATION */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="avatar-circle">{donorData?.name?.charAt(0) || "D"}</div>
          <p>{donorData?.name || "Donor"}</p>
        </div>
        <button className={view === "dashboard" ? "side-btn active" : "side-btn"} onClick={() => setView("dashboard")}>🏠 Dashboard</button>
        <button className={view === "profile" ? "side-btn active" : "side-btn"} onClick={() => setView("profile")}>👤 My Profile</button>
      </div>

      <div className="main-content">
        {view === "dashboard" ? (
          <div className="dashboard-grid-main" style={{ display: 'flex', gap: '30px', padding: '20px' }}>
            {/* LEFT PANEL: POST AVAILABILITY FORM */}
            <div className="form-panel" style={{ flex: 1 }}>
              <div className="glass-card">
                <h2 className="panel-title" style={{ color: '#e63946' }}>Inform Seekers</h2>
                <form onSubmit={handlePostOffer} className="modern-form">
                  <input type="text" placeholder="Your Name" value={donorName} onChange={(e) => setDonorName(e.target.value)} required className="form-input" />
                  <input type="text" placeholder="Mobile Number" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required className="form-input" />
                  <input type="text" placeholder="Current Location" value={location} onChange={(e) => setLocation(e.target.value)} required className="form-input" />
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '14px' }}>Date Available</label>
                    <input type="date" value={availableDate} onChange={(e) => setAvailableDate(e.target.value)} required className="form-input" />
                  </div>
                  <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="form-input" style={{ minHeight: '80px' }} />
                  <button type="submit" className="post-btn" disabled={isPosting}>
                    {isPosting ? "Processing..." : "POST AVAILABILITY"}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT PANEL: SEEKER REQUESTS */}
            <div className="requests-panel" style={{ flex: 1.5 }}>
              <h2 className="panel-title">Blood Requests</h2>
              <div className="filter-box">
                <select value={searchBlood} onChange={(e) => filterBloodType(e.target.value)} className="blood-select">
                  <option value="">All Blood Types</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="scroll-area">
                {filteredRequests.map((req) => (
                  <div className="request-card-modern" key={req.id}>
                    <h3>{req.seekerName} ({req.bloodType})</h3>
                    <p>🏥 {req.hospitalName}</p>
                    <p>📞 {req.contactPhone}</p>
                    <div className="button-row">
                      <button className="accept-btn" onClick={() => accept(req.id)}>Accept</button>
                      <button className="reject-btn" onClick={() => reject(req.id)}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* MY PROFILE VIEW */
          <div className="profile-view-container">
            <h2 className="section-title">My Profile & Impact</h2>
            <div className="profile-hero-card">
              <div className="profile-top">
                <div className="hero-avatar">{donorData?.name?.charAt(0)}</div>
                <div className="hero-details">
                  <h1>{donorData?.name}</h1>
                  <span className="hero-blood-badge">{donorData?.bloodType} Donor</span>
                </div>
              </div>

              <div className="impact-stats">
                <div className="stat-card">
                  <span className="stat-val">{livesSavedCount}</span>
                  <span className="stat-lab">Lives Saved</span>
                </div>
                <div className="stat-card">
                  <span className="stat-val">{requests.length}</span>
                  <span className="stat-lab">Requests Handled</span>
                </div>
              </div>

             <div className="personal-info-list">
  <div className="info-row">
    <strong>📍 Location:</strong> {donorProfile?.city || donorProfile?.location || "N/A"}
  </div>
  <div className="info-row">
    <strong>📞 Contact:</strong> {donorProfile?.phone || donorProfile?.contactPhone || "No Number"}
  </div>
  <div className="info-row">
    <strong>📧 Email:</strong> {donorProfile?.email || "No Email Found"}
  </div>
</div>
            </div>
          </div>
        )}
        {showThankYou && (
  <div className="thank-you-overlay">
    <div className="thank-you-card">
      <div className="heart-animation">❤️</div>
      <h2>You are a Life Saver!</h2>
      <p>Thank you for accepting. Your impact score has been updated in your profile.</p>
      <div className="progress-bar-container">
        <div className="progress-fill"></div>
      </div>
      <button onClick={() => setShowThankYou(false)} className="close-hero-btn">
        Keep Helping
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
}