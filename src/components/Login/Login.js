import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login-CSS/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/auth/login", {
        email,
        password,
      })
      .then((res) => {
        if (res.data.status) {
          navigate("/home");
        } else {
          setErrorMessage("Login failed. Please check your credentials.");
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("An error occurred. Please try again later.");
      });
  };

  return (
    <div className="container1">
      <h1>Login to Portal</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <input type="submit" value="Login" className="btn btn-primary" />
      </form>

      <button className="register-btn" onClick={() => navigate("/register")}>
        Register
      </button>

      <button
        className="forgot-password-btn"
        onClick={() => navigate("/forgotPassword")}
      >
        Forgot Password
      </button>

      <button className="admin-login-btn" onClick={() => navigate("/adminLogin")}>
        Admin Login
      </button>
    </div>
  );
};

export default Login;
