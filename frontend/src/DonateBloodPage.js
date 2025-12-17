import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

function DonateBloodPage() {
  const [donors, setDonors] = useState([]);
  const [formData, setFormData] = useState({ name: '', bloodType: '', email: '', city: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/donors');
      setDonors(response.data);
    } catch (error) {
      console.error("Error fetching donors:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        await axios.delete(`/api/donors/${id}`);
        fetchDonors(); // Refresh the list
      } catch (error) {
        console.error("Error deleting donor:", error);
        alert('Failed to delete donor.');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/donors', formData);
      alert('Thank you for registering!');
      setFormData({ name: '', bloodType: '', email: '', city: '' });
      fetchDonors();
    } catch (error) {
      console.error("Error registering donor:", error);
      alert('Failed to register.');
    }
  };

  const filteredDonors = useMemo(() => {
    if (!filter) return donors;
    return donors.filter(donor => donor.bloodType === filter);
  }, [filter, donors]);

  return (
    <div className="page-container">
      <section className="form-section">
        <h2>Become a Donor</h2>
        {/* Donor Form Component Here */}
        <form onSubmit={handleSubmit}>
          {/* Form groups are the same as before */}
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Blood Type</label>
             <select name="bloodType" value={formData.bloodType} onChange={handleInputChange} required>
              <option value="">Select...</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleInputChange} />
          </div>
          <button type="submit" className="submit-btn">Register to Donate</button>
        </form>
      </section>

      <section className="list-section">
        <h2>Available Donors ({filteredDonors.length})</h2>
        <div className="filter-container">
          <div className="form-group">
            <label>Filter by Blood Type</label>
            <select onChange={(e) => setFilter(e.target.value)} value={filter}>
              <option value="">All</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
            </select>
          </div>
        </div>
        <div className="data-list">
          {isLoading ? (
            <p className="status-message">Loading...</p>
          ) : filteredDonors.length > 0 ? (
            <ul>
              {filteredDonors.map(donor => (
                <li key={donor.id} className="card">
                  <div className="card-info">
                    <span className="name">{donor.name}</span>
                    <span>{donor.email} | {donor.city}</span>
                  </div>
                  <div className='card-info'>
                    <span className="blood-type">{donor.bloodType}</span>
                  </div>
                  <button onClick={() => handleDelete(donor.id)} className="delete-btn">Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="status-message">No donors found. Be the first!</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DonateBloodPage;