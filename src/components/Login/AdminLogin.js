import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login-CSS/login.css";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    const userData = { email, password };
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/admin/login`, userData)
      .then((result) => {        
        if (result.data.message === "Password Incorrect") {
          setErrorMessage("Incorrect Password");
        } else if (result.data.message === "Admin") {
          navigate("/admin");
        } else if (result.data.message === "Invalid User") {
          setErrorMessage("Invalid Admin User");
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      })
      .catch((err) => {
        setErrorMessage("Server error. Please try again.");
        console.log(err);
      });
  };

  return (
    <div className="modern-login-container admin-theme">
      <div className="login-form-container">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Access the management dashboard</p>
        </div>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        
        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button">Login</button>
        </form>
        
        <div className="login-footer">
          <button className="text-button" onClick={() => navigate("/forgotpassword")}>
            Forgot Password?
          </button>
          <button className="text-button" onClick={() => navigate("/admin/register")}>
            Register New Admin
          </button>
          <button className="text-button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
      
      <div className="login-image admin-image">
        <div className="overlay"></div>
        <div className="image-content">
          <h2>Manage Placement Process</h2>
          <p>Track statistics, manage companies, and help students succeed</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
