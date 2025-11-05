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
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [viewerPassword, setViewerPassword] = useState("");
  const [viewerError, setViewerError] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    const userData = { email, password };
    
    // First try Admin table login (for registered admins)
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/admin/login`, userData)
      .then((result) => {        
        if (result.data.message === "Admin") {
          console.log("Admin login successful from Admin table");
          localStorage.setItem("userRole", "admin");
          navigate("/admindashboard");
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      })
      .catch((err) => {
        console.log("Admin table login failed, trying User table:", err.response?.data);
        // If not in Admin table, try User table for users with admin/viewer roles
        tryUserTableLogin();
      });
  };

  const tryUserTableLogin = () => {
    const userData = { email, password };
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, userData)
      .then((result) => {
        console.log("User table login result:", result.data);
        
        // Backend returns strings for errors, objects for success
        if (result.data === "Password Incorrect") {
          setErrorMessage("Incorrect Password");
          return;
        }
        
        if (result.data === "Invalid User") {
          setErrorMessage("Invalid credentials. Please check your email and password.");
          return;
        }
        
        // Check if login was successful (object response)
        if (result.status === 200 && result.data && typeof result.data === 'object') {
          const userRole = result.data.role || 'student';
          
          // Only allow admin and viewer roles
          if (userRole === 'admin') {
            console.log("User with admin role found in User table");
            localStorage.setItem("userRole", "admin");
            navigate("/admindashboard");
          } else if (userRole === 'viewer') {
            console.log("User with viewer role found in User table");
            localStorage.setItem("userRole", "viewer");
            navigate("/viewerdashboard");
          } else {
            setErrorMessage("Access denied. You need admin or viewer privileges.");
          }
        } else {
          setErrorMessage("Invalid credentials or insufficient privileges.");
        }
      })
      .catch((err) => {
        console.log("User table login error:", err);
        setErrorMessage("Invalid credentials. Please check your email and password.");
      });
  };

  const handleViewerAccess = () => {
    setShowViewerModal(true);
    setViewerPassword("");
    setViewerError("");
  };

  const handleViewerSubmit = (e) => {
    e.preventDefault();
    // Use a dedicated viewer account for backend authentication
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
      email: "viewer@jobvault.com", // Replace with your actual viewer email
      password: viewerPassword
    }, { withCredentials: true })
      .then((result) => {
        // Check for string error responses first
        if (result.data === "Password Incorrect" || result.data === "Invalid User") {
          setViewerError("Incorrect viewer password.");
          return;
        }
        
        // Check object response
        if (result.data && typeof result.data === 'object' && result.data.role === "viewer") {
          localStorage.setItem("userRole", "viewer");
          setShowViewerModal(false);
          navigate("/viewerdashboard");
        } else {
          setViewerError("Incorrect viewer password or insufficient privileges.");
        }
      })
      .catch(() => {
        setViewerError("Incorrect viewer password.");
      });
  };

  return (
    <div className="modern-login-container admin-theme">
      <div className="login-form-container">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Access the management dashboard</p>
          <div style={{ 
            backgroundColor: "#e7f3ff", 
            border: "1px solid #b3d9ff", 
            borderRadius: "5px", 
            padding: "10px", 
            marginTop: "10px",
            fontSize: "14px"
          }}>
            <strong>Access Levels:</strong>
            <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
              <li><strong>Admin:</strong> Full access to all features</li>
              <li><strong>Viewer:</strong> View reports and download data</li>
            </ul>
          </div>
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
        <button className="login-button" style={{ marginTop: '16px', background: '#ffc107', color: '#333' }} onClick={handleViewerAccess}>
          View Reports
        </button>
        {showViewerModal && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', minWidth: '320px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <h2 style={{ marginBottom: '16px', color: '#5f3dc4' }}>View Reports Access</h2>
              <form onSubmit={handleViewerSubmit}>
                <input
                  type="password"
                  placeholder="Enter viewer password"
                  value={viewerPassword}
                  onChange={e => setViewerPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
                  required
                />
                {viewerError && <div style={{ color: 'red', marginBottom: '8px' }}>{viewerError}</div>}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" onClick={() => setShowViewerModal(false)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ background: '#5f3dc4', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer' }}>Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
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
