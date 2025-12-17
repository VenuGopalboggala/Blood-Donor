import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DonationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/donations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <h2>My Donation History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>You have no donation records yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((d, index) => (
            <li key={index} className="card">
              <h3>Recipient: {d.recipientName}</h3>
              <p><strong>Blood Type:</strong> {d.bloodType}</p>
              <p><strong>Date:</strong> {new Date(d.donationDate).toDateString()}</p>
              {d.notes && <p><strong>Notes:</strong> {d.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
