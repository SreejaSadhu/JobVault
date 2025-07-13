import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';
import { motion } from 'framer-motion';
import Navbar from "../HomeComponents/Navbar.js";
import Footer from "../HomeComponents/Footer.js";

function InterviewExperience() {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInterviews = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/fetchinterviewexperience`);
      setInterviews(response.data.data);
    } catch (error) {
      console.error('Error fetching interview experiences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/verify`).then((res) => {
      if (!res.data.status) {
        // Handle unauthorized access
      }
    });
  }, []);

  const sanitizeContent = (content) => {
    return sanitizeHtml(content, {
      allowedTags: ['p', 'br', 'b', 'i', 'u', 'em', 'strong'],
      allowedAttributes: {},
    });
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'easy':
        return '#28a745'; 
      case 'medium':
        return '#ffc107'; 
      case 'difficult':
        return '#e70000'; 
      default:
        return '#6c757d'; 
    }
  };

  const getResultColor = (result) => {
    return result === 'Successful' ? '#28a745' : '#e70000'; 
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>Interview Experiences</h1>
          <Link to="/addexperience" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#007bff', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: '8px' }}>
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Interview Experience
            </motion.button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #007bff', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite' 
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ listStyleType: 'none', padding: 0, margin: 0 }}
          >
            {interviews.map((interview) => (
              <motion.li
                key={interview._id}
                variants={itemVariants}
                style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                  marginBottom: '24px', 
                  overflow: 'hidden',
                  transition: 'box-shadow 0.3s'
                }}
                whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
              >
                <div style={{ padding: '24px' }}>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                    justifyContent: 'space-between', 
                    alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
                    marginBottom: '16px' 
                  }}>
                    <div style={{ marginBottom: window.innerWidth < 768 ? '16px' : '0' }}>
                      <h3 style={{ marginBottom: '8px', color: '#007bff', fontWeight: '600', fontSize: '1.1rem' }}>Posted by: {interview.username}</h3>
                      <h3 style={{ marginBottom: '8px', color: '#333', fontWeight: '700', fontSize: '1.25rem' }}>Company: {interview.companyName}</h3>
                      <p style={{ marginBottom: '8px', color: '#555', fontSize: '1.1rem' }}>Position: {interview.position}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ 
                        backgroundColor: getDifficultyColor(interview.interviewLevel), 
                        color: '#fff', 
                        padding: '5px 12px', 
                        borderRadius: '20px', 
                        marginRight: '10px', 
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {interview.interviewLevel}
                      </span>
                      <span style={{ 
                        backgroundColor: getResultColor(interview.result), 
                        color: '#fff', 
                        padding: '5px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {interview.result}
                      </span>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
                    <div 
                      style={{ color: '#444', lineHeight: '1.6' }}
                      dangerouslySetInnerHTML={{ __html: sanitizeContent(interview.experience) }} 
                    />
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
        
        {interviews.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '48px 0' }}
          >
            <p style={{ color: '#666', fontSize: '1.1rem' }}>No interview experiences found. Be the first to share yours!</p>
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default InterviewExperience;
