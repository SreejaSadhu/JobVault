import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Admin-CSS/AdminNav.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/admin-login");
  };
  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <Link to="/admindashboard" className="navbar-brand me-auto">JobVault</Link>
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">JobVault</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/admindashboard">Reports</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/companies">Manage Companies</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/scheduledinterviewdata">Interview Reports</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/userroles">User Roles</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/admin-login" onClick={handleLogout}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
