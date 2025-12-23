import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SeekerForm.css";

const API_BASE_URL = "https://blood-donor-jkjv.onrender.com";

export default function SeekerDashboard() {
  const [view, setView] = useState("request"); // Toggle between 'request' and 'donors'
  const [donors, setDonors] = useState([]);
  
  // Existing Form states
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [hospital, setHospital] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch donors only when the user clicks the "Available Donors" tab
  useEffect(() => {
    if (view === "donors") {
      fetchDonors();
    }
  }, [view]);

  const fetchDonors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/donors`);
      setDonors(res.data);
    } catch (err) {
      console.error("Error fetching donors:", err);
    }
  };

  // YOUR EXISTING CONNECTION LOGIC - UNCHANGED
  async function submitRequest(e) {
    e.preventDefault();
    setStatusMessage("Submitting...");

    const storedId = localStorage.getItem("userId");
    console.log("Dashboard checking userId:", storedId);

    if (!storedId || storedId === "null" || storedId === "undefined") {
      setStatusMessage("❌ Error: Seeker ID missing. Please log out and back in.");
      return;
    }

    try {
      const payload = {
        seekerId: parseInt(storedId), 
        seekerName: name,
        bloodType: bloodType,
        hospitalName: hospital,
        contactPhone: phone,
        message: message || "Urgent blood request",
        donorId: null 
      };

      await axios.post(`${API_BASE_URL}/api/blood-request`, payload);

      setStatusMessage("✔ Request submitted successfully.");
      setName(""); setBloodType(""); setHospital(""); setPhone(""); setMessage("");
      
    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      setStatusMessage(`❌ Failed: ${err.response?.data?.message || "Check network"}`);
    }
  }

  return (
    <div className="seeker-dashboard-wrapper">
      <div className="sidebar">
        <h2 className="brand-logo">Blood Network</h2>
        <button className={view === "request" ? "side-link active" : "side-link"} onClick={() => setView("request")}>
          💉 Request Blood
        </button>
        <button className={view === "donors" ? "side-link active" : "side-link"} onClick={() => setView("donors")}>
          👥 Available Donors
        </button>
      </div>

      <div className="main-content">
        {view === "request" ? (
          <div className="glass-card">
            <h2 className="section-title">Blood Request Form</h2>
            <form className="modern-form" onSubmit={submitRequest}>
              <div className="input-box">
                <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="input-box">
                <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} required>
                  <option value="">Select Blood Type</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="input-box">
                <input type="text" placeholder="Hospital Name" value={hospital} onChange={(e) => setHospital(e.target.value)} required />
              </div>
              <div className="input-box">
                <input type="text" placeholder="Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="input-box">
                <textarea placeholder="Message (Optional)" value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <button className="gradient-btn" type="submit">Submit Request</button>
              {statusMessage && <p className={`status-text ${statusMessage.includes("✔") ? "success" : "error"}`}>{statusMessage}</p>}
            </form>
          </div>
        ) : (
          <div className="donor-section">
            <h2 className="section-title">Donors in Your Area</h2>
            <div className="donor-grid">
              {donors.length > 0 ? donors.map(donor => (
                <div className="donor-card-styled" key={donor.id}>
                  <div className="blood-icon">{donor.bloodType}</div>
                  <div className="donor-details">
                    <h3>{donor.name}</h3>
                    <p>📍 {donor.city}</p>
                    <span className={`availability-tag ${donor.isAvailable ? "online" : "offline"}`}>
                      {donor.isAvailable ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>
              )) : <p>Loading active donors...</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}