import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SeekerForm.css";

const API_BASE_URL = "https://blood-donor-jkjv.onrender.com";

export default function SeekerDashboard() {
  // 1. Set default view to "overview" instead of "request"
  const [view, setView] = useState("overview"); 
  const [donorOffers, setDonorOffers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [hospital, setHospital] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (view === "offers") fetchOffers();
  }, [view]);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/donor-offer`);
      setDonorOffers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching donor offers:", err);
    }
  };

  async function submitRequest(e) {
    e.preventDefault();
    const storedId = localStorage.getItem("userId");
    const payload = {
      seekerId: parseInt(storedId),
      seekerName: name,
      bloodType,
      hospitalName: hospital,
      contactPhone: phone,
      message: message || "Urgent blood requirement",
      donorId: null 
    };

    try {
      await axios.post(`${API_BASE_URL}/api/blood-request`, payload);
      setIsSubmitted(true);
      // Clear form
      setName(""); setBloodType(""); setHospital(""); setPhone(""); setMessage("");
    } catch (err) {
      alert("Submission failed. Check your connection.");
    }
  }

  // Success View Logic remains the same
  if (isSubmitted) {
    return (
      <div className="success-screen">
        <div className="success-card">
          <div className="success-check-icon">✔</div>
          <h1 className="big-success-text">Submitted Successfully!</h1>
          <p>Your request is now live. Donors in your area can view your requirements and contact you.</p>
          <div className="success-actions">
            <button className="gradient-btn" onClick={() => setIsSubmitted(false)}>
              Post Another Request
            </button>
            <button className="outline-btn" onClick={() => { setIsSubmitted(false); setView("offers"); }}>
              View Available Donors
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="seeker-dashboard-wrapper">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h3 className="sidebar-logo">Blood Network</h3>
        {/* Added Overview Button */}
        <button 
          className={view === "overview" ? "side-link active" : "side-link"} 
          onClick={() => setView("overview")}
        >
          🏠 Dashboard Home
        </button>
        <button 
          className={view === "request" ? "side-link active" : "side-link"} 
          onClick={() => setView("request")}
        >
          💉 Request Blood
        </button>
        <button 
          className={view === "offers" ? "side-link active" : "side-link"} 
          onClick={() => setView("offers")}
        >
          🤝 Donor Offers
        </button>
      </div>

      <div className="main-content">
        {/* 2. New Default Overview View */}
        {view === "overview" && (
          <div className="overview-container">
            <h2 className="section-title">Welcome to Seeker Dashboard</h2>
            <div className="welcome-card">
              <p>Quickly find donors or post a new request to get help immediately.</p>
              <div className="action-cards">
                <div className="mini-card" onClick={() => setView("request")}>
                  <h3>Need Blood?</h3>
                  <p>Click here to fill the request form.</p>
                </div>
                <div className="mini-card" onClick={() => setView("offers")}>
                  <h3>Check Donors</h3>
                  <p>View donors who are currently available.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "request" && (
          <div className="glass-card">
            <h2 className="section-title">New Blood Request</h2>
            <form onSubmit={submitRequest} className="modern-form">
              {/* ... Your Form Inputs ... */}
              <input type="text" placeholder="Patient Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} required>
                <option value="">Select Blood Type</option>
                {["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="text" placeholder="Hospital & City" value={hospital} onChange={(e) => setHospital(e.target.value)} required />
              <input type="text" placeholder="Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <textarea placeholder="Additional Message" value={message} onChange={(e) => setMessage(e.target.value)} />
              <button className="gradient-btn" type="submit">Post Request</button>
            </form>
          </div>
        )}

        {view === "offers" && (
          <div className="donor-section">
            <h2 className="section-title">Available Donor Offers</h2>
            <div className="donor-grid">
              {donorOffers.map(offer => (
                <div className="donor-card-styled" key={offer.id}>
                  <h3>📍 {offer.location}</h3>
                  <p>📅 {offer.availabilityDate}</p>
                  <a href={`tel:${offer.contactPhone}`} className="call-btn">📞 Call Donor</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}