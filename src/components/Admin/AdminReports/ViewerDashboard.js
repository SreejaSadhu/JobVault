import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import "../Admin-CSS/AdminDashboard.css";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import AdminHome from "../AdminHome.js";

function ViewerDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filters, setFilters] = useState({
    tenthPercentage: "",
    twelfthPercentage: "",
    graduationCGPA: "",
    yearOfGraduation: "",
    placementStatus: "",
  });
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Verify viewer access
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/verifyViewer`).then((res) => {
      if (res.data.status) {
        console.log("Viewer verified successfully");
        setUserRole(res.data.role);
      } else {
        console.log("Viewer verification failed, redirecting to login");
        navigate("/");
      }
    }).catch((err) => {
      console.error("Viewer verification error:", err);
      navigate("/");
    });
  }, [navigate]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/auth/getUsers`)
      .then((response) => {
        setUsers(response.data.data);
        setOriginalUsers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  const applyFilters = () => {
    let filteredUsers = originalUsers.filter((user) => {
      return (
        (!filters.tenthPercentage ||
          user.tenthPercentage >= parseFloat(filters.tenthPercentage)) &&
        (!filters.twelfthPercentage ||
          user.twelfthPercentage >= parseFloat(filters.twelfthPercentage)) &&
        (!filters.graduationCGPA ||
          user.graduationCGPA >= parseFloat(filters.graduationCGPA)) &&
        (!filters.yearOfGraduation ||
          user.yearOfGraduation === parseInt(filters.yearOfGraduation)) &&
        (!selectedProgram || user.stream === selectedProgram) &&
        (!filters.placementStatus ||
          user.placementStatus === filters.placementStatus)
      );
    });
    setSelectedProgram("");
    setUsers(filteredUsers);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleProgramChange = (e) => {
    setSelectedProgram(e.target.value);
  };

  const resetFilters = () => {
    setFilters({
      tenthPercentage: "",
      twelfthPercentage: "",
      graduationCGPA: "",
      yearOfGraduation: "",
      placementStatus: "",
    });
    setUsers(originalUsers);
  };

  return (
    <>
      <AdminHome />
      <div className="contain.er" style={{ marginTop: "150px" }}>
        <div style={{ 
          backgroundColor: "#fff3cd", 
          border: "1px solid #ffeaa7", 
          borderRadius: "5px", 
          padding: "15px", 
          marginBottom: "20px",
          textAlign: "center"
        }}>
          <h3 style={{ color: "#856404", margin: "0" }}>
            📊 View-Only Mode - {userRole === 'viewer' ? 'Viewer Access' : 'Admin Access'}
          </h3>
          <p style={{ color: "#856404", margin: "5px 0 0 0" }}>
            You can view all data and download reports, but cannot make modifications.
          </p>
        </div>
        
        <h1 className="page-heading">User Reports (View-Only)</h1>
        <div className="filter-container">
          <div className="filter-group">
            <label htmlFor="tenthPercentage" className="filter-label">
              Filter by 10th Percentage:
            </label>
            <input
              type="number"
              id="tenthPercentage"
              name="tenthPercentage"
              value={filters.tenthPercentage}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="twelfthPercentage" className="filter-label">
              Filter by 12th Percentage:
            </label>
            <input
              type="number"
              id="twelfthPercentage"
              name="twelfthPercentage"
              value={filters.twelfthPercentage}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="graduationCGPA" className="filter-label">
              Filter by Graduation CGPA:
            </label>
            <input
              type="number"
              id="graduationCGPA"
              name="graduationCGPA"
              value={filters.graduationCGPA}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="yearOfGraduation" className="filter-label">
              Filter by Year of Graduation:
            </label>
            <input
              type="number"
              id="yearOfGraduation"
              name="yearOfGraduation"
              value={filters.yearOfGraduation}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="stream" className="filter-label">
              Filter by Program:
            </label>
            <select
              id="stream"
              name="stream"
              value={selectedProgram}
              onChange={handleProgramChange}
              className="filter-input"
            >
              <option value="">Select Stream</option>
              <option value="MCA">MCA</option>
              <option value="Btech-IT">Btech-IT</option>
              <option value="Btech-CS">Btech-CS</option>
              <option value="Btech-Cybersecurity">Btech-Cybersecurity</option>
              <option value="Btech-Data Science">Btech-Data Science</option>
              <option value="Btech-Mechatronics">Btech-Mechatronics</option>
              <option value="Btech-EXTC">Btech-Extc</option>
              <option value="BTech-Integrated">BTech-Integrated</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="placementStatus" className="filter-label">
              Filter by Placement Status:
            </label>
            <select
              id="placementStatus"
              name="placementStatus"
              value={filters.placementStatus}
              onChange={handleChange}
              className="filter-input"
            >
              <option value="">Select Status</option>
              <option value="Placed">Placed</option>
              <option value="Unplaced">Unplaced</option>
            </select>
          </div>
          <div className="filter-group">
            <button
              onClick={applyFilters}
              className="filter-button button-spacing"
            >
              Apply Filters
            </button>
            <button onClick={resetFilters} className="filter-button">
              Reset Filters
            </button>
            <div className="filter-container"></div>

            <button onClick={handleDownload} className="download-button">
              Download
            </button>
          </div>
        </div>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>SAP ID</th>
              <th>Date of Birth</th>
              <th>10th Percentage</th>
              <th>10th School</th>
              <th>12th Percentage</th>
              <th>12th College</th>
              <th>Graduation College</th>
              <th>Graduation CGPA</th>
              <th>Stream</th>
              <th>Year of Graduation</th>
              <th>Placement Status</th>
              <th>Company Placed</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.contactNumber}</td>
                <td>{user.sapId}</td>
                <td>{user.dob}</td>
                <td>{user.tenthPercentage}</td>
                <td>{user.tenthSchool}</td>
                <td>{user.twelfthPercentage}</td>
                <td>{user.twelfthCollege}</td>
                <td>{user.graduationCollege}</td>
                <td>{user.cgpa}</td>
                <td>{user.stream}</td>
                <td>{user.yearOfGraduation}</td>
                <td>{user.placementStatus}</td>
                <td>{user.companyPlaced}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}

export default ViewerDashboard; 