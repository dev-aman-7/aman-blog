// src/Login.js
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { ApiUrl } from "../url";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, setAccessToken, setRefreshToken, setLoggedInUser } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    const { usernameOrEmail, password } = loginData;
    const data = {};

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail);

    if (isEmail) {
      data.email = usernameOrEmail;
    } else {
      data.username = usernameOrEmail;
    }

    data.password = password;

    try {
      const response = await axios.post(`${ApiUrl.userBaseUrl}/login`, data);
      if (response.data.success) {
        login();
        setAccessToken(response.data.data.accessToken);
        setRefreshToken(response.data.data.refreshToken);
        setLoggedInUser(response.data.data.user);
        navigate("/");
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-60 p-6 bg-white border rounded shadow mb-48">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <div className="mb-4">
          <label
            htmlFor="usernameOrEmail"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username or Email
          </label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            value={loginData.usernameOrEmail}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </div>
    </>
  );
};

export default Login;
