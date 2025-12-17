import React, { useState } from "react";
import axios from "axios";

// ONLY CHANGE: Added dynamic API URL for live deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function DonorDetails() {
  const [bloodType, setBloodType] = useState("");
  const [city, setCity] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [alertMsg, setAlertMsg] = useState("");

  const token = localStorage.getItem("token");

  const handleSave = async () => {
    try {
      // UPDATED LINK: Using API_BASE_URL instead of localhost
      await axios.put(
        `${API_BASE_URL}/api/donors/updateDetails`,
        { bloodType, city, isAvailable },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Details saved successfully!");
      window.location.href = "/donor"; // go to dashboard
    } catch (err) {
      setAlertMsg("Failed to update details.");
    }
  };

  return (
    <div className="page-container">
      <h2>Complete Your Donor Profile</h2>

      <div className="input-group">
        <label>Blood Type</label>
        <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
          <option value="">Select...</option>
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
        <label>City</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} />
      </div>

      <div className="input-group">
        <label>Available to Donate</label>
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
      </div>

      <button className="submit-btn" onClick={handleSave}>
        Save Details
      </button>

      {alertMsg && <p>{alertMsg}</p>}
    </div>
  );
}