// frontend/src/components/SeekerDashboard.js
import React, { useState } from "react";
import axios from "axios";
import "./SeekerForm.css";

// Hardcoded Render URL to ensure it connects from the Netlify link
const API_BASE_URL = "https://blood-donor-jkjv.onrender.com";

export default function SeekerDashboard() {
  // Form fields state
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [hospital, setHospital] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  async function submitRequest(e) {
    e.preventDefault();
    setStatusMessage("Submitting...");

    try {
      // 1. Get the seekerId from localStorage (set during login)
      const storedId = localStorage.getItem("userId");
      
      if (!storedId) {
        setStatusMessage("❌ Error: You must be logged in to request blood.");
        return;
      }

      // 2. Prepare the data exactly as the backend expects it
      const payload = {
        seekerId: parseInt(storedId), // Ensure it's an Integer
        seekerName: name,
        bloodType: bloodType,
        hospitalName: hospital,
        contactPhone: phone,
        message: message || "No additional message provided.",
        donorId: null // Explicitly null for a general request
      };

      // 3. POST to the live API
      await axios.post(`${API_BASE_URL}/api/blood-request`, payload);

      // 4. Success handling
      setStatusMessage("✔ Request submitted successfully.");
      setName("");
      setBloodType("");
      setHospital("");
      setPhone("");
      setMessage("");
      
    } catch (err) {
      // Log details to help you see exactly what the server didn't like
      console.error("400 Error Details:", err.response?.data);
      setStatusMessage(`❌ Failed: ${err.response?.data?.message || "Check console for missing fields"}`);
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
              placeholder="Message (Optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-box"
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