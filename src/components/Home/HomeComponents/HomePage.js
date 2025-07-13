import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "../../../redux/companySlice.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/interviewimg.png";
import Navbar from "./Navbar.js";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);

  const [currentUser, setCurrentUser] = useState(null);
  const [placementStatus, setPlacementStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        console.log("Starting authentication check...");
        
        // First test if server is reachable
        try {
          const testResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/test`);
          console.log("Server test response:", testResponse.data);
        } catch (testError) {
          console.error("Server test failed:", testError);
        }
        
        // First verify authentication
        const verifyResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/verify`);
        console.log("Verify response:", verifyResponse.data);
        
        if (!verifyResponse.data.status) {
          console.log("Authentication failed:", verifyResponse.data.message);
          navigate("/");
          return;
        }

        console.log("Authentication successful, fetching user data...");
        
        // Then get current user
        const userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/currentUser`);
        console.log("Backend response:", userResponse.data);
        
        if (userResponse.data && userResponse.data.status && userResponse.data.user && userResponse.data.user._id) {
          setCurrentUser(userResponse.data.user);
          console.log("User data set, fetching placement status...");
          await fetchPlacementStatus(userResponse.data.user._id);
        } else {
          console.log("No user data received or invalid response:", userResponse.data);
          setCurrentUser(null);
        }

        console.log("Fetching companies...");
        
        // Fetch companies
        const companiesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/getCompanies`);
        dispatch(getCompanies(companiesResponse.data));
        
        console.log("Initialization complete");
        
      } catch (error) {
        console.error("Error during initialization:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.message;
          if (errorMessage === "No Token" || errorMessage === "Token Expired" || errorMessage === "Invalid Token") {
            console.log("Authentication error:", errorMessage, "- redirecting to login");
            navigate("/");
            return;
          }
        }
        
        // For other errors, show a user-friendly message
        console.log("Other error occurred, but continuing...");
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [navigate, dispatch]);

  const fetchPlacementStatus = async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/placementStatus/${userId}`);
      setPlacementStatus(response.data);
    } catch (error) {
      console.error("Error fetching placement status:", error);
      // Don't fail the entire app if placement status fails
    }
  };

  if (isLoading) {
    return (
      <div className="home-container" style={{ marginTop: '100px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          {currentUser && (
            <>
              <h1 className="primary-heading" style={{ color: "rgba(85,107,247,255)", fontSize: "80px", fontWeight: "700px" }}>
                Welcome {currentUser.name}
              </h1>
              {placementStatus && placementStatus.status === "Placed" && (
  <p style={{
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
    color: 'green',
    marginTop: '20px',
    marginLeft:'30px',
    fontWeight: 'bold',
   
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    backgroundColor: 'transparent',
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = 'lightgreen'}
  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
  >
    Congratulations! You are placed at {placementStatus.companyName}
  </p>
)}
            </>
          )}
<p className="primary-text" style={{ textAlign: 'center', marginLeft: '20px' }}>Welcome to your Placement Management System! Explore career opportunities, company profiles, and upcoming interviews. Manage your profile, upload resumes, and track application progress seamlessly.</p>

           
        </div>
        <div className="home-image-section">
          <img src={BannerImage} style={{ width: "570px", height: "550px" }} alt="Banner" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
