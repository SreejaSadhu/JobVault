import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Admin-CSS/AdminNav.css';
import axios from "axios";

function AdminHome() {
  const navigate = useNavigate();

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
    <></>
  );
}



export default AdminHome;
