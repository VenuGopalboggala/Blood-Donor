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
      // 1. Get the seekerId from localStorage (ensure this was set in Login.js)
      const storedId = localStorage.getItem("userId");
      
      // SAFETY CHECK: If the ID is missing, stop and alert the user
      if (!storedId) {
        setStatusMessage("❌ Error: Seeker ID missing. Please log out and log in again.");
        return;
      }

      // 2. Prepare the data payload
      const payload = {
        seekerId: parseInt(storedId), // Force conversion to Integer for the DB
        seekerName: name,
        bloodType: bloodType,
        hospitalName: hospital,
        contactPhone: phone,
        message: message || "Urgent blood request",
        donorId: null // Explicitly null for general requests
      };

      // Debugging: View exactly what is being sent in the browser console
      console.log("Sending payload to backend:", payload);

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
      // Log details to the console to see the exact field the backend is rejecting
      console.error("Submission Error:", err.response?.data);
      setStatusMessage(`❌ Failed: ${err.response?.data?.message || "Check console for details"}`);
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
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
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