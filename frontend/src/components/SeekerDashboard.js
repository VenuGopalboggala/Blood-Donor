// frontend/src/components/SeekerDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SeekerForm.css";

// The hardcoded live Render URL to ensure connection from Netlify
const API_BASE_URL = "https://blood-donor-jkjv.onrender.com";

export default function SeekerDashboard() {
  const [view, setView] = useState("request");

  // form fields state
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [hospital, setHospital] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  async function submitRequest(e) {
    e.preventDefault();
    try {
      // Get the ID from localStorage and convert to Number
      const seekerId = localStorage.getItem("userId");

      // Construct the payload to match exactly what the backend/database expects
      const payload = {
        seekerId: parseInt(seekerId), // Ensure this is an Integer
        seekerName: name,
        bloodType: bloodType,
        hospitalName: hospital,
        contactPhone: phone,
        message: message || "Urgent blood request", // Default message if empty
        donorId: null // Explicitly null for a general request to avoid 400 error
      };

      // POST request to the live Render API
      await axios.post(`${API_BASE_URL}/api/blood-request`, payload);

      // Success handling
      setStatusMessage("✔ Request submitted successfully.");
      setName("");
      setBloodType("");
      setHospital("");
      setPhone("");
      setMessage("");
      
    } catch (err) {
      // Log the specific error from the server to help debugging
      console.error("Submission Error Response:", err.response?.data);
      setStatusMessage(`❌ Failed: ${err.response?.data?.message || "Check network logs"}`);
    }
  }

  return (
    <div className="seeker-wrapper">
      <div className="seeker-card">
        <h2 className="title">Request Blood</h2>

        <form className="form-container" onSubmit={submitRequest}>
          <div className="input-group">
            <span className="icon">👤</span>
            <input 
              type="text" 
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">🩸</span>
            <select 
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              required
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="input-group">
            <span className="icon">🏥</span>
            <input 
              type="text" 
              placeholder="Hospital Name"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">📞</span>
            <input 
              type="text" 
              placeholder="Contact Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">💬</span>
            <textarea 
              placeholder="Additional Message (Optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>

          <button className="submit-btn" type="submit">
            Submit Request
          </button>

          {statusMessage && (
            <p className={statusMessage.includes("✔") ? "msg success" : "msg error"}>
              {statusMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}