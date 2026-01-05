import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css";

const API_BASE_URL = "https://blood-donor-jkjv.onrender.com";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: New Password
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("donor");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // STEP 1: Verify Email
 const handleVerifyEmail = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // .trim() removes accidental spaces, .toLowerCase() ensures it matches the DB format
    const cleanEmail = email.trim().toLowerCase(); 
    
    const res = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { 
      email: cleanEmail, 
      userType 
    });
    
    setMessage(res.data.message);
    setStep(2);
  } catch (err) {
    setMessage(err.response?.data?.message || "User not found.");
  } finally {
    setLoading(false);
  }
};

  // STEP 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email,
        userType,
        newPassword
      });
      alert("✅ Password updated successfully!");
      navigate(userType === "donor" ? "/login/donor" : "/login/seeker");
    } catch (err) {
      alert("❌ Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-card">
        <h2 className="title">Reset Password</h2>
        <p className="subtitle">
          {step === 1 
            ? "Enter your email to find your account." 
            : "Enter a strong new password below."}
        </p>

        {message && <p className="status-msg">{message}</p>}

        {step === 1 ? (
          <form onSubmit={handleVerifyEmail} className="modern-form">
            <select value={userType} onChange={(e) => setUserType(e.target.value)} className="form-input">
              <option value="donor">I am a Donor</option>
              <option value="seeker">I am a Seeker</option>
            </select>
            <input 
              type="email" 
              placeholder="Registered Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="form-input"
            />
            <button type="submit" className="gradient-btn" disabled={loading}>
              {loading ? "Verifying..." : "Find Account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="modern-form">
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              className="form-input"
            />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              className="form-input"
            />
            <button type="submit" className="gradient-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
        
        <button className="back-link" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
}