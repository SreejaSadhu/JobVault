import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Registeration-CSS/RegistrationPage.css";

function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!adminCode || adminCode !== "ADMIN_SECRET") {
      setErrorMessage("Invalid admin code");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/register`, {
        name,
        email,
        password,
        adminCode
      });

      if (response.status === 200) {
        alert("Admin registered successfully! Please login with your credentials.");
        navigate("/admin-login");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 400 && error.response.data.message === "User already exists") {
          setErrorMessage("Email already registered");
        } else {
          setErrorMessage(error.response.data.message || "Registration failed. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        setErrorMessage("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="registration-background">
      <div className="registration-container">
        <h1>Admin Registration</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="adminCode">Admin Code</label>
              <input
                type="password"
                id="adminCode"
                className="form-control"
                placeholder="Admin Code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ visibility: 'hidden' }}>
              {/* Empty for alignment */}
              <label>&nbsp;</label>
              <input style={{ visibility: 'hidden' }} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Register as Admin
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminRegister;
