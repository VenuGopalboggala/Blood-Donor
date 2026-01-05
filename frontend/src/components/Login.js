import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE_URL = "https://blood-donor-jkjv.onrender.com";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [isDonor, setIsDonor] = useState(true);

  // Form Fields State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [city, setCity] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  
  // UI Feedback State
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setEmail(""); setPassword(""); setName(""); setBloodType("");
    setCity(""); setHospitalName(""); setContactPhone("");
    setLat(""); setLng(""); setError("");
  };

  const handleToggleView = () => { setIsLoginView(!isLoginView); resetForm(); };
  const handleToggleUserType = (isDonorLogin) => { setIsDonor(isDonorLogin); resetForm(); };

  // Combined Login and Registration Logic
  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // 🟢 Start loading indicator

    const userType = isDonor ? "donor" : "seeker";

    try {
      if (isLoginView) {
        // --- LOGIN LOGIC ---
        const response = await axios.post(`${API_BASE_URL}/api/auth/login/${userType}`, { email, password });
        const idToStore = response.data.userId;
        
        if (idToStore) {
          localStorage.clear();
          localStorage.setItem("userId", String(idToStore));
          localStorage.setItem("userType", userType);
          localStorage.setItem("token", response.data.token);
          
          setTimeout(() => {
            onLogin(response.data.token, userType);
          }, 100);
        } else {
          setError("Login successful, but server did not return a userId.");
        }
      } else {
        // --- REGISTRATION LOGIC ---
        let regData = isDonor 
          ? { name, email, password, bloodType, city } 
          : { name, email, password, bloodType, hospitalName, contactPhone, lat, lng };

        await axios.post(`${API_BASE_URL}/api/auth/register/${userType}`, regData);
        alert(`${userType} registered successfully! Please login.`);
        setIsLoginView(true);
        resetForm();
      }
    } catch (err) {
      // 🔴 Error Handling
      if (isLoginView) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Registration failed. Email may already be in use.");
      }
    } finally {
      setIsLoading(false); // ⚪ Stop loading regardless of outcome
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="toggle-wrapper">
          <button 
            className={isDonor ? "toggle-btn active" : "toggle-btn"} 
            onClick={() => handleToggleUserType(true)}
            disabled={isLoading}
          >
            Donor
          </button>
          <button 
            className={!isDonor ? "toggle-btn active" : "toggle-btn"} 
            onClick={() => handleToggleUserType(false)}
            disabled={isLoading}
          >
            Seeker
          </button>
        </div>
        
        <h2 className="login-title">
          {isLoginView ? `${isDonor ? "Donor" : "Seeker"} Login` : `${isDonor ? "Donor" : "Seeker"} Registration`}
        </h2>

        <form onSubmit={handleAuthAction} className="login-form">
          {!isLoginView && (
            <>
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
              <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} required disabled={isLoading}>
                <option value="">Select Blood Type</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
                   <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {isDonor ? (
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required disabled={isLoading} />
              ) : (
                <>
                  <input type="text" placeholder="Hospital Name" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} required disabled={isLoading} />
                  <input type="text" placeholder="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required disabled={isLoading} />
                </>
              )}
            </>
          )}
          
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
          
          {isLoginView && (
            <div className="forgot-password-link" onClick={() => !isLoading && navigate("/forgot-password")}>
              Forgot Password?
            </div>
          )}

          {error && <p className="error">{error}</p>}
          
          {/* 🔘 Updated Button with Loading State */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Please wait, server is waking up..." : (isLoginView ? "Login" : "Register")}
          </button>
        </form>

        <p className="switch-link" onClick={() => !isLoading && handleToggleView()}>
          {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </p>
      </div>
    </div>
  );
}

export default Login;