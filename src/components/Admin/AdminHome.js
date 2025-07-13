import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Admin/Admin-CSS/AdminNav.css';

function AdminHome() {
  const navigate = useNavigate();

  function handleLogout() {
    // Clear user session (e.g., remove token)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login"); // Redirect to login page
  }

  return (
    <></>
  );
}

export default AdminHome;
