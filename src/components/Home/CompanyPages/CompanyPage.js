import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "../../../redux/companySlice.jsx";
import Footer from "../HomeComponents/Footer.js";
import Navbar from "../HomeComponents/Navbar.js";
import ApplyJobs from "../Assets/applyjobs.png";
import "../Home-CSS/CompanyPage.css";

function CompanyPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const companies = useSelector((state) => state.companies.companies);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/getCompanies/${id}`
        );
        dispatch(getCompanies(response.data));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id]);

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

  const handleApply = async (companyId, userId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/applyCompany/${userId}/${id}`
      );
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = response.data.message;
      document.body.appendChild(successMessage);
      
      // Remove message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);

      const updatedResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/getCompanies/${id}`
      );
      dispatch(getCompanies(updatedResponse.data));
      navigate("/scheduledInterview");
    } catch (error) {
      console.error(error);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.textContent = "Error applying to company. Please try again.";
      document.body.appendChild(errorMessage);
      
      // Remove message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    }
  };

  return (
    <div className="company-page-container">
      <div className="company-page-header">
        <h1>Company Details</h1>
        <p>Review the job opportunity and apply if you meet the eligibility criteria</p>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading company details...</p>
        </div>
      ) : (
        <div className="company-content">
          <div className="company-image-container">
            <img
              src={ApplyJobs}
              alt="Apply Job"
              className="company-image"
            />
          </div>

          <div className="company-details-container">
            {companies.map((company) => (
              <div key={company.id} className="company-card">
                <div className="company-header">
                  <h1 className="company-name">{company.companyname}</h1>
                  <p>{company.jobprofile}</p>
                </div>
                
                <div className="company-info">
                  <div className="info-item">
                    <span className="info-label">CTC Package</span>
                    <span className="info-value highlight">{company.ctc} LPA</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Interview Date</span>
                    <span className="info-value">{new Date(company.doi).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Job Description</span>
                    <p className="info-value">{company.jobdescription}</p>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Eligibility Criteria</span>
                    <div className="eligibility-criteria">
                      <div className="criteria-item">
                        <span className="criteria-label">10th Percentage</span>
                        <span className="criteria-value">{company.tenthPercentage}%</span>
                      </div>
                      <div className="criteria-item">
                        <span className="criteria-label">12th Percentage</span>
                        <span className="criteria-value">{company.twelfthPercentage}%</span>
                      </div>
                      <div className="criteria-item">
                        <span className="criteria-label">Graduation CGPA</span>
                        <span className="criteria-value">{company.graduationCGPA}</span>
                      </div>
                      <div className="criteria-item">
                        <span className="criteria-label">6th Semester CGPA</span>
                        <span className="criteria-value">{company.sixthSemesterCGPA}</span>
                      </div>
                    </div>
                  </div>
                  
                  {company.eligibilityCriteria && company.eligibilityCriteria.length > 0 && (
                    <div className="info-item">
                      <span className="info-label">Additional Requirements</span>
                      <p className="info-value">{company.eligibilityCriteria.join(", ")}</p>
                    </div>
                  )}
                </div>
                
                <div className="apply-button-container">
                  <button
                    onClick={() => handleApply(company._id, currentUser?._id)}
                    className="apply-btn"
                    disabled={!currentUser}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default CompanyPage;
