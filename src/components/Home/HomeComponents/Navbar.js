import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Home-CSS/AdminNav.css';
import axios from 'axios';

const StudentNavbar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [showViewerAccess, setShowViewerAccess] = useState(false);

  useEffect(() => {
    // Check if user has viewer or admin access
    const checkViewerAccess = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/verifyViewer`);
        if (response.data.status) {
          setUserRole(response.data.role);
          setShowViewerAccess(true);
        }
      } catch (error) {
        // User doesn't have viewer access, which is fine
        console.log("User doesn't have viewer access");
      }
    };

    checkViewerAccess();
  }, []);

  const handleLogout = () => {
    // 1. Clear client-side tokens
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    
    // 2. Clear cookies
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // 3. Invalidate server-side session
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {}, {
      withCredentials: true // Important for sending cookies
    })
    .then(() => {
      // 4. Navigate to login page
      navigate("/");
    })
    .catch((error) => {
      console.error("Logout error:", error);
      // Even if there's an error, still navigate to login
      navigate("/");
    });
  };
  
  return (
    <body>
    <nav className="navbar navbar-expand-lg fixed-top">
    <div className="container-fluid">
          <Link to="/home" className="navbar-brand me-auto" >JobVault</Link>
          <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">JobVault</h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/home">Home</Link>
                </li>
              <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/companylisting">Company Listing</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/scheduledInterview">Scheduled Interviews</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/faq">FAQ</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/interviewexperience">Interview Experience</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/profile">My Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link mx-lg-2" to="/" onClick={handleLogout}>Logout</Link>
                </li>
                </ul>
              </div>
        </div>
        </div>
      </nav>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
      integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" 
      crossOrigin="anonymous">
    </script>
  </body>
  );
};

export default StudentNavbar;