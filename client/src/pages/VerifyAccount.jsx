// src/VerifyAccount.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleInputChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerify = () => {
    const isVerified = otp === "123456";
    if (isVerified) {
      navigate("/dashboard");
    } else {
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-64 p-6 bg-white border rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">Verify Account</h2>
        <div className="mb-4">
          <label
            htmlFor="otp"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Enter 6-digit OTP
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            pattern="\d{6}"
            maxLength="6"
            minLength="6"
            required
          />
        </div>
        <button
          type="button"
          onClick={handleVerify}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Verify
        </button>
      </div>
    </>
  );
};

export default VerifyAccount;
