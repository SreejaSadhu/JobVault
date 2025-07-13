import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Admin-CSS/AdminDashboard.css";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import AdminHome from "../AdminHome.js";

function UserRoleManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    // Verify admin access
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/verify`).then((res) => {
      if (res.data.status) {
        console.log("Admin verified successfully");
        fetchUsers();
      } else {
        console.log("Admin verification failed, redirecting to login");
        navigate("/");
      }
    }).catch((err) => {
      console.error("Admin verification error:", err);
      navigate("/");
    });
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/getUsersWithRoles`);
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const assignViewerRole = async (userId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/assignViewerRole`, {
        userId
      });
      setMessage(`Viewer role assigned to ${response.data.user.name}`);
      fetchUsers(); // Refresh the list
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error assigning viewer role:", error);
      setMessage("Error assigning viewer role");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const removeViewerRole = async (userId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/removeViewerRole`, {
        userId
      });
      setMessage(`Viewer role removed from ${response.data.user.name}`);
      fetchUsers(); // Refresh the list
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error removing viewer role:", error);
      setMessage("Error removing viewer role");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHome />
        <div className="contain.er" style={{ marginTop: "150px" }}>
          <div className="loading">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AdminHome />
      {userRole === 'viewer' && (
        <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ color: '#856404', margin: 0 }}>View-Only Mode - Viewer Access</h3>
          <p style={{ color: '#856404', margin: '5px 0 0 0' }}>You can view all user roles but cannot make changes.</p>
        </div>
      )}
      <div className="admin-dashboard-container">
        <h1 className="admin-section-title">User Roles</h1>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>SAP ID</th>
              <th>Stream</th>
              <th>Current Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.sapId}</td>
                <td>{user.stream}</td>
                <td>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: 
                      user.role === 'admin' ? "#dc3545" :
                      user.role === 'viewer' ? "#ffc107" : "#28a745",
                    color: 
                      user.role === 'admin' ? "white" :
                      user.role === 'viewer' ? "#212529" : "white"
                  }}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>
                  {userRole !== 'viewer' && user.role === 'student' && (
                    <button
                      onClick={() => assignViewerRole(user._id)}
                      style={{
                        backgroundColor: "#ffc107",
                        color: "#212529",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "5px"
                      }}
                    >
                      Grant Viewer Access
                    </button>
                  )}
                  {userRole !== 'viewer' && user.role === 'viewer' && (
                    <button
                      onClick={() => removeViewerRole(user._id)}
                      style={{
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Remove Viewer Access
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <span style={{ color: "#6c757d", fontStyle: "italic" }}>
                      Full Admin (No changes needed)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}

export default UserRoleManagement; 