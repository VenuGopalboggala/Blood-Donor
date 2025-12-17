import React, { useState } from "react";
import axios from "axios";
import "./Login.css";   // <-- IMPORTANT: include new CSS file

function Login({ onLogin }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isDonor, setIsDonor] = useState(true);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [city, setCity] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setBloodType("");
    setCity("");
    setHospitalName("");
    setContactPhone("");
    setLat("");
    setLng("");
    setError("");
  };

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    resetForm();
  };

  const handleToggleUserType = (isDonorLogin) => {
    setIsDonor(isDonorLogin);
    resetForm();
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError("");

    const userType = isDonor ? "donor" : "seeker";

    // LOGIN
    if (isLoginView) {
      try {
        const response = await axios.post(
          `http://localhost:3001/api/auth/login/${userType}`,
          { email, password }
        );

        onLogin(response.data.token, userType);
      } catch (err) {
        setError("Invalid email or password. Please try again.");
      }
      return;
    }

    // REGISTRATION
    let registrationData;

    if (isDonor) {
      registrationData = { name, email, password, bloodType, city };
    } else {
      registrationData = {
        name,
        email,
        password,
        bloodType,
        hospitalName,
        contactPhone,
        lat,
        lng,
      };
    }

    try {
      await axios.post(
        `http://localhost:3001/api/auth/register/${userType}`,
        registrationData
      );

      alert(`${userType} registered successfully! Please login.`);
      setIsLoginView(true);
      resetForm();
    } catch (err) {
      setError("Registration failed. Email may already be in use.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        
        {/* TOGGLE BUTTONS */}
        <div className="toggle-wrapper">
          <button
            className={isDonor ? "toggle-btn active" : "toggle-btn"}
            onClick={() => handleToggleUserType(true)}
          >
            Donor
          </button>
          <button
            className={!isDonor ? "toggle-btn active" : "toggle-btn"}
            onClick={() => handleToggleUserType(false)}
          >
            Seeker
          </button>
        </div>

        <h2 className="login-title">
          {isLoginView
            ? `${isDonor ? "Donor" : "Seeker"} Login`
            : `${isDonor ? "Donor" : "Seeker"} Registration`}
        </h2>

        <form onSubmit={handleAuthAction} className="login-form">
          {/* REGISTRATION FIELDS */}
          {!isLoginView && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
              </select>

              {isDonor ? (
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Hospital Name"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact Phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </>
              )}
            </>
          )}

          {/* COMMON FIELDS */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ERROR MESSAGE */}
          {error && <p className="error">{error}</p>}

          <button type="submit" className="submit-btn">
            {isLoginView ? "Login" : "Register"}
          </button>
        </form>

        <p className="switch-link" onClick={handleToggleView}>
          {isLoginView
            ? "Don't have an account? Sign Up"
            : "Already have an account? Log In"}
        </p>
      </div>
    </div>
  );
}

export default Login;
