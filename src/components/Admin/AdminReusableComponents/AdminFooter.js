import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Admin-CSS/Footer.css";
// Import for FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { 
  faLinkedinIn, 
  faGithubAlt, 
  faTwitter 
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const navigate = useNavigate();

  // Function to handle navigation with authentication check
  const handleNavigation = (path, e) => {
    e.preventDefault();
    // Navigate to the path
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2 className="logo-text">JobVault</h2>
          <p>
            Your one-stop platform for campus placements and career opportunities.
            Connect with top companies and kickstart your professional journey.
          </p>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
            <a href="#"><FontAwesomeIcon icon={faGithubAlt} /></a>
            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
          </div>
        </div>

        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admindashboard">Reports</Link></li>
            <li><Link to="/companies">Companies</Link></li>
            <li><Link to="/scheduledinterviewdata">Interview Reports</Link></li>
          </ul>
        </div>

        <div className="footer-section founders">
          <h2>Founders</h2>
          <ul>
            <li>Sreeja Sadhu</li>
            <li>Y Manu Palash Reddy</li>
            <li>K Ruthwik</li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h2>Contact Us</h2>
          <div className="contact-info">
            <div><FontAwesomeIcon icon={faEnvelope} /> sreejasadhu2006@gmail.com</div>
            <div><FontAwesomeIcon icon={faEnvelope} /> manupalash4@gmail.com</div>
            <div><FontAwesomeIcon icon={faEnvelope} /> ruthwikkanuganti@gmail.com</div>
            <div><FontAwesomeIcon icon={faPhone} /> +91 9876543210</div>
            <div><FontAwesomeIcon icon={faMapMarkerAlt} /> Hyderabad, India</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} JobVault | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
