import React, { useState } from "react";
import "./NewUser.css";
import { API } from '../constants/api';

const NewUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

const handleSendMail = async () => {
  if (email && username) {
    try {
      const response = await fetch(API.CREATE_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          status: ""
        }),
      });

      if (response.ok) {
        // only parse JSON if there's content
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        console.log("User created and OTP sent:", data);
        setOtpSent(true);
        setError("");
      } else {
        setError("Failed to create user");
      }
    } catch (err) {
      console.error("Sending OTP failed", err);
      setError("Failed to create user");
    }
  } else {
    setError("Username and Email are required");
  }
};

  const verifyOtp = async () => {
  try {
    const response = await fetch(API.VERIFY_USER+ `otp=${otp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
          username: username,
          email: email,
          status: ""
        }),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (response.ok && data.success !== false) {
      console.log("OTP Verified Successfully");
      setShowPassword(true);
      setOtpVerified(true);
      setError("");
    } else {
      setError(data.message || "Invalid OTP");
    }
  } catch (err) {
    console.error("OTP verification failed", err);
    setError("Failed to verify OTP");
  }
//  try {
//   const response = await axios.post('https://vbr-office-backend.onrender.com/test/saveUser',{
//     method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//      body: JSON.stringify({
//           username: username,
//           password: email,
//           status: ""
//         }),
//     });

//     catch (err) {
//     console.error("OTP verification failed", err);
//     setError("Failed to verify OTP");
//   }

};


  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
      console.log("Password set successfully");
      // Proceed with form submission logic
    }
  };

  return (
     <div className="new-user-container">
      <h2 className="new-user-title">Create Account In VBR Associates</h2>

      <div className="new-user-form">
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="new-user-input"
        />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="new-user-input"
        />
        <button onClick={handleSendMail} className="new-user-button">
          Send Mail
        </button>
      </div>

      {otpSent && !otpVerified && (
        <div className="new-user-form">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="new-user-input"
          />
          <button onClick={verifyOtp} className="new-user-button">
            Verify OTP
          </button>
        </div>
      )}

      {showPassword && (
        <div className="new-user-form">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="new-user-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="new-user-input"
          />
          {error && <div className="new-user-error">{error}</div>}
          <button onClick={handleSubmit} className="new-user-button">
            Submit
          </button>
        </div>
      )}

      {error && !showPassword && <div className="new-user-error">{error}</div>}
    </div>
  );
};

export default NewUser;