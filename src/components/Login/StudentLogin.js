import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login-CSS/login.css";

function StudentLogin() {
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
      .post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, userData)
      .then((result) => {        
        if (result.status === 200) {
          localStorage.setItem("userRole", "student");
          navigate("/home");
        } else if (result.data === "Password Incorrect") {
          setErrorMessage("Incorrect Password");
        } else if (result.data === "Admin") {
          setErrorMessage("Please use Admin login for administrator accounts");
        } else {
          setErrorMessage("Invalid User");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="modern-login-container">
      <div className="login-form-container">
        <div className="login-header">
          <h1>Student Login</h1>
          <p>Access your placement portal</p>
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
          <button className="text-button" onClick={() => navigate("/register")}>
            New Student? Register
          </button>
          <button className="text-button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
      
      <div className="login-image">
        <div className="overlay"></div>
        <div className="image-content">
          <h2>Find Your Dream Job</h2>
          <p>Connect with top companies and kickstart your career</p>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;