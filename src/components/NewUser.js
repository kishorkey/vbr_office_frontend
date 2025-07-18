import React, { useState } from "react";
import "./NewUser.css";
import { API } from '../constants/api';
import { useNavigate } from 'react-router-dom';

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
  const history = useNavigate();

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
    const response = await fetch(API.VERIFY_USER + `otp=${otp}`, {
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
    const isVerified = text === "true"; // Backend returns boolean as plain text

    if (response.ok && isVerified) {
      console.log("OTP Verified Successfully");
      setShowPassword(true);
      setOtpVerified(true);
      setError("");
    } else {
      setError("Invalid OTP");
    }
  } catch (err) {
    console.error("OTP verification failed", err);
    setError("Failed to verify OTP");
  }

};


const saveUser = async () => {
  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setError(""); // clear previous errors

  try {
    const response = await fetch(API.SAVE_USER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: confirmPassword,
        status: ""
      }),
    });

    if (response.ok) {
      console.log("User saved successfully");
      history('/'); // redirect only if save is successful
    } else {
      const text = await response.text();
      setError(text || "Failed to save user");
    }

  } catch (err) {
    console.error("Save user failed", err);
    setError("Something went wrong while saving user");
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
          <button onClick={saveUser} className="new-user-button">
            Submit
          </button>
        </div>
      )}

      {error && !showPassword && <div className="new-user-error">{error}</div>}
    </div>
  );
};

export default NewUser;