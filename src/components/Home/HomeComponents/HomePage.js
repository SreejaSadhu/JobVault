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

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/verify`).then((res) => {
      if (!res.data.status) {
        navigate("/");
      }
    });

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/auth/currentUser`)
      .then((res) => {
        if (res.data && res.data.user && res.data.user._id) {
          setCurrentUser(res.data.user);
          fetchPlacementStatus(res.data.user._id);
        } else {
          setCurrentUser(null);
          // Optionally handle missing user (e.g., redirect or show message)
        }
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
      });
  }, []);

  const fetchPlacementStatus = async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/placementStatus/${userId}`);
      setPlacementStatus(response.data);
    } catch (error) {
      console.error("Error fetching placement status:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/getCompanies`
        );
        dispatch(getCompanies(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-container" style={{ marginTop: '100px' }}>
      <Navbar />
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
