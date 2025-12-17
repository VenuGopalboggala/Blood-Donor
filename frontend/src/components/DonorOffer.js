import React, { useState } from "react";
import axios from "axios";
import "./donorOffer.css";

// ONLY CHANGE: Added dynamic API URL for live deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function DonorOffer() {
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function submitOffer(e) {
    e.preventDefault();

    try {
      const donorId = localStorage.getItem("userId");   // IMPORTANT

      if (!donorId) {
        setStatus("❌ Error: donorId missing. Login again.");
        return;
      }

      // UPDATED LINK: Using API_BASE_URL instead of localhost
      const res = await axios.post(`${API_BASE_URL}/api/donor-offer`, {
        donorId,
        location,
        message,
      });

      setStatus("✔ Offer submitted successfully!");
      setLocation("");
      setMessage("");

    } catch (err) {
      console.error("Offer submit error:", err);
      setStatus("❌ Failed to submit offer. Try again.");
    }
  }

  return (
    <div className="offer-container">
      <h2>Offer to Donate Blood</h2>

      <form className="offer-form" onSubmit={submitOffer}>
        <input
          type="text"
          placeholder="Enter your location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <textarea
          placeholder="Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit" className="offer-btn">
          Submit Offer
        </button>
      </form>

      {status && <p className="status-text">{status}</p>}
    </div>
  );
}