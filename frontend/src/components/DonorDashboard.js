import React, { useEffect, useState } from "react";
import axios from "axios";
import "./donorDashboard.css";

// FORCED CHANGE: Using your direct Render URL to fix the "localhost" error on Netlify
const API_BASE_URL = "https://blood-donor-jkjv.onrender.com";

export default function DonorDashboard() {
  const donorId = localStorage.getItem("userId");
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchBlood, setSearchBlood] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      // Calls your live Render backend directly
      const res = await axios.get(
        `${API_BASE_URL}/api/blood-request/donor/${donorId}`
      );

      setRequests(res.data);
      setFilteredRequests(res.data);
    } catch (err) {
      console.error("Error loading requests:", err);
    }
  }

  function filterBloodType(type) {
    setSearchBlood(type);
    if (type === "") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter((req) => req.bloodType === type));
    }
  }

  async function accept(id) {
    try {
      await axios.put(`${API_BASE_URL}/api/blood-request/accept/${id}`);
      loadRequests();
    } catch (err) {
      console.error("Accept error:", err);
    }
  }

  async function reject(id) {
    try {
      await axios.put(`${API_BASE_URL}/api/blood-request/reject/${id}`);
      loadRequests();
    } catch (err) {
      console.error("Reject error:", err);
    }
  }

  return (
    <div className="donor-dashboard-container">
      <h2 className="title">Blood Requests</h2>

      <div className="filter-box">
        <select
          value={searchBlood}
          onChange={(e) => filterBloodType(e.target.value)}
        >
          <option value="">Filter by Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>

      <div className="requests-grid">
        {filteredRequests.length === 0 ? (
          <p>No requests available.</p>
        ) : (
          filteredRequests.map((req) => (
            <div className="request-card" key={req.id}>
              <h3>{req.seekerName}</h3>
              <p>🩸 <b>{req.bloodType}</b></p>
              <p>🏥 {req.hospitalName}</p>
              <p>📞 {req.contactPhone}</p>

              <div className="button-row">
                <button className="accept-btn" onClick={() => accept(req.id)}>
                  Accept
                </button>
                <button className="reject-btn" onClick={() => reject(req.id)}>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}