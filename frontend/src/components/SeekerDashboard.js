import React, { useState } from "react";
import axios from "axios";
import "./SeekerForm.css";

const API_BASE_URL = "https://blood-donor-jkjv.onrender.com";

export default function SeekerDashboard() {
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [hospital, setHospital] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  async function submitRequest(e) {
    e.preventDefault();
    setStatusMessage("Submitting...");

    // Try to get the ID saved by Login.js
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
    <div className="seeker-wrapper">
      <div className="seeker-card">
        <h2 className="title">Request Blood</h2>
        <form className="form-container" onSubmit={submitRequest}>
          <div className="input-group">
            <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} required>
              <option value="">Select Blood Type</option>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option>
              <option>O+</option><option>O-</option>
            </select>
          </div>
          <div className="input-group">
            <input type="text" placeholder="Hospital Name" value={hospital} onChange={(e) => setHospital(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="text" placeholder="Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="input-group">
            <textarea placeholder="Message (Optional)" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <button className="submit-btn" type="submit">Submit Request</button>
          {statusMessage && <p className={statusMessage.includes("✔") ? "msg success" : "msg error"}>{statusMessage}</p>}
        </form>
      </div>
    </div>
  );
}