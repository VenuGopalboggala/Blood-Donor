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

    // 1. Force read from storage
    const storedId = localStorage.getItem("userId");
    console.log("Dashboard checking userId:", storedId);

    if (!storedId || storedId === "undefined" || storedId === "null") {
      setStatusMessage("❌ Error: Seeker ID missing. Please log out and back in.");
      return;
    }

    try {
      const payload = {
        seekerId: parseInt(storedId), // Ensure Integer
        seekerName: name,
        bloodType: bloodType,
        hospitalName: hospital,
        contactPhone: phone,
        message: message || "Urgent request",
        donorId: null 
      };

      console.log("Payload being sent:", payload);

      await axios.post(`${API_BASE_URL}/api/blood-request`, payload);

      setStatusMessage("✔ Request submitted successfully.");
      setName(""); setBloodType(""); setHospital(""); setPhone(""); setMessage("");
      
    } catch (err) {
      console.error("400 Error details:", err.response?.data);
      setStatusMessage(`❌ Failed: ${err.response?.data?.message || "Check console"}`);
    }
  }

  return (
    <div className="seeker-wrapper">
      <div className="seeker-card">
        <h2 className="title">Request Blood</h2>
        <form className="form-container" onSubmit={submitRequest}>
          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} required>
            <option value="">Select Blood Type</option>
            <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
          </select>
          <input type="text" placeholder="Hospital Name" value={hospital} onChange={(e) => setHospital(e.target.value)} required />
          <input type="text" placeholder="Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className="submit-btn" type="submit">Submit Request</button>
          {statusMessage && <p className="msg">{statusMessage}</p>}
        </form>
      </div>
    </div>
  );
}