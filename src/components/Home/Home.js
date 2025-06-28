import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, deleteCompany } from "../../redux/companySlice.jsx";
import ScheduledInterview from "./CompanyPages/ScheduledInterview.js";
import HomePage from './HomeComponents/HomePage.js';
import About from "./HomeComponents/About.js";
import Work from "./HomeComponents/Work.js";
import Feedback from "./HomeComponents/Feedback.js";
import Contact from "./HomeComponents/Contact.js";
import Footer from "./HomeComponents/Footer.js";
import "./Home-CSS/Application.css";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/verify`);
        if (!response.data.status) {
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/");
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="App">
      <HomePage />
      <About />
      <Work />
      <Feedback />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;
