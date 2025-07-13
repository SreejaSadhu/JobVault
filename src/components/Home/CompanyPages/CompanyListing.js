import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, deleteCompany } from "../../../redux/companySlice.jsx";
import Navbar from "../HomeComponents/Navbar.js";
import Footer from "../HomeComponents/Footer.js";
import "../Home-CSS/CompanyListing.css"; // Add a new CSS file for styling

function CompanyListing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("all");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/verify`).then((res) => {
      if (!res.data.status) {
        navigate("/");
      }
    });

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/auth/currentUser`)
      .then((res) => {
        setCurrentUser(res.data.user);
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/getCompanies`
        );
        dispatch(getCompanies(response.data));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  // Filter companies based on search term and filter criteria
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.companyname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.jobprofile.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterCriteria === "all") return matchesSearch;
    if (filterCriteria === "highCTC") return matchesSearch && parseFloat(company.ctc) >= 10;
    if (filterCriteria === "upcoming") {
      const interviewDate = new Date(company.doi);
      const today = new Date();
      return matchesSearch && interviewDate > today;
    }
    return matchesSearch;
  });

  return (
    <>
      <div className="company-listing-container">
        <div className="company-listing-header">
          <h1>Ongoing Campus Placement Drives</h1>
          <p>Explore opportunities with top companies visiting our campus</p>
          
          <div className="search-filter-container">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search by company or job profile..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search"></i>
            </div>
            
            <div className="filter-options">
              <select 
                value={filterCriteria}
                onChange={(e) => setFilterCriteria(e.target.value)}
              >
                <option value="all">All Companies</option>
                <option value="highCTC">High CTC (10+ LPA)</option>
                <option value="upcoming">Upcoming Drives</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading companies...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="no-companies">
            <h3>No companies match your search criteria</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="company-cards-container">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="company-card">
                <div className="company-logo-placeholder">
                  {company.companyname.charAt(0)}
                </div>
                <div className="company-info">
                  <h3>{company.companyname}</h3>
                  <div className="company-details">
                    <div className="detail-item">
                      <span className="detail-label">Profile:</span>
                      <span className="detail-value">{company.jobprofile}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">CTC:</span>
                      <span className="detail-value highlight">{company.ctc} LPA</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Interview Date:</span>
                      <span className="detail-value">{company.doi}</span>
                    </div>
                  </div>
                  <Link to={`/companypage/${company.id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CompanyListing;
