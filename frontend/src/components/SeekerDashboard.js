// frontend/src/components/SeekerDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SeekerForm.css";

export default function SeekerDashboard() {
  const [view, setView] = useState("request");

  // fields
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [hospital, setHospital] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function submitRequest(e) {
    e.preventDefault();
    try {
      const seekerId = localStorage.getItem("userId");

      await axios.post("http://localhost:3001/api/blood-request", {
        seekerId,
        seekerName: name,
        bloodType,
        hospitalName: hospital,
        contactPhone: phone,
        message,
      });

      setMessage("✔ Request submitted successfully.");
      setName("");
      setBloodType("");
      setHospital("");
      setPhone("");
    } catch (err) {
      setMessage("❌ Failed to submit request.");
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
              onChange={(e)=>setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">🩸</span>
            <select 
              value={bloodType}
              onChange={(e)=>setBloodType(e.target.value)}
              required
            >
              <option value="">Select Blood Type</option>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option>
              <option>O+</option><option>O-</option>
            </select>
          </div>

          <div className="input-group">
            <span className="icon">🏥</span>
            <input 
              type="text" 
              placeholder="Hospital Name"
              value={hospital}
              onChange={(e)=>setHospital(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">📞</span>
            <input 
              type="text" 
              placeholder="Contact Phone"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              required
            />
          </div>

          <button className="submit-btn" type="submit">
            Submit Request
          </button>

          {message && <p className="msg">{message}</p>}
        </form>
      </div>
    </div>
  );
}
