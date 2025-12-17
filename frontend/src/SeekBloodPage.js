import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SeekBloodPage() {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({ name: '', bloodType: '', contactPhone: '', hospitalName: '' });

  // Fetch requests when the component loads
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/recipients');
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!formData.name || !formData.bloodType || !formData.contactPhone || !formData.hospitalName) {
        alert('Please fill in all fields.');
        return;
    }
    try {
      await axios.post('/api/recipients', formData);
      alert('Your request has been submitted.');
      setFormData({ name: '', bloodType: '', contactPhone: '', hospitalName: '' }); // Clear form
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error("Error submitting request:", error);
      alert('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <section className="form-section">
        <h2>Request Blood</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Patient's Full Name" required />
          </div>
          <div className="form-group">
            <label>Required Blood Type</label>
            <select name="bloodType" value={formData.bloodType} onChange={handleInputChange} required>
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
          <div className="form-group">
            <label>Contact Phone</label>
            <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} placeholder="Phone Number" required />
          </div>
          <div className="form-group">
            <label>Hospital Name</label>
            <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleInputChange} placeholder="Hospital Name & City" required />
          </div>
          <button type="submit" className="submit-btn">Submit Request</button>
        </form>
      </section>

      <section className="list-section">
        <h2>Active Requests</h2>
        <div className="data-list">
          <ul>
            {requests.map(req => (
              <li key={req.id}>
                Request for <strong>{req.name}</strong> needing <strong>{req.bloodType}</strong> blood at {req.hospitalName}.
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );    
}

export default SeekBloodPage;