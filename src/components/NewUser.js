import React, { useState } from "react";

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
      const response = await fetch("http://localhost:8080/test/createUser", {
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
    const response = await fetch(`http://localhost:8080/test/verifyUser?otp=${otp}`, {
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
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Email OTP Verification</h2>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "1rem" }}
      />
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "1rem" }}
      />
      <button onClick={handleSendMail} style={{ marginBottom: "1rem" }}>
        Send Mail
      </button>

      {otpSent && !otpVerified && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          />
          <button onClick={verifyOtp} style={{ marginBottom: "1rem" }}>
            Verify OTP
          </button>
        </>
      )}

      {showPassword && (
        <>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          />
          {error && (
            <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
          )}
          <button onClick={handleSubmit}>
            Submit
          </button>
        </>
      )}

      {error && !showPassword && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}
    </div>
  );
};

export default NewUser;