import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.js';
import Footer from './Footer.js';
import '../Home-CSS/StudentProfile.css';

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verify user authentication
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/verify`).then((res) => {
      if (!res.data.status) {
        navigate("/");
      }
    });

    // Fetch user profile data
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/currentUser`);
        setProfileData(response.data.user);
        // Initialize editedData with current profile data
        setEditedData({
          name: response.data.user?.name || '',
          phone: response.data.user?.contactNumber || '',
          dob: response.data.user?.dob || '',
          gender: response.data.user?.gender || '',
          address: response.data.user?.address || '',
          college: response.data.user?.graduationCollege || '',
          degree: response.data.user?.stream || '',
          major: response.data.user?.stream || '',
          cgpa: response.data.user?.cgpa || '',
          yearOfGraduation: response.data.user?.yearOfGraduation || '',
          skills: response.data.user?.skills || [],
          experience: response.data.user?.experience || [],
          projects: response.data.user?.projects || [],
          linkedinUrl: response.data.user?.linkedinUrl || '' // Add LinkedIn URL field
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset success message when toggling edit mode
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      // Map the edited data to match the expected server field names
      const updatedData = {
        name: editedData.name,
        contactNumber: editedData.phone, // Changed from 'phone' to 'contactNumber'
        dob: editedData.dob,
        gender: editedData.gender,
        address: editedData.address,
        graduationCollege: editedData.college, // Changed from 'college' to 'graduationCollege'
        stream: editedData.degree, // Changed from 'degree' to 'stream'
        cgpa: editedData.cgpa, // Corrected to use cgpa
        yearOfGraduation: editedData.yearOfGraduation,
        skills: editedData.skills,
        experience: editedData.experience,
        projects: editedData.projects,
        linkedinUrl: editedData.linkedinUrl // Add LinkedIn URL to updated data
      };
  
      console.log('Sending data to server:', updatedData);
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/updateProfile`, 
        updatedData
      );
      
      if (response.data.status) {
        // Update the profile data with the response data
        setProfileData(response.data.user);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(`Failed to update profile: ${err.message}`);
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/home')}>Return to Home</button>
      </div>
    );
  }

  return (
    <>
      <div className="student-profile-container">
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="profile-header" style={{ background: 'linear-gradient(135deg, #556bf7 0%, #3a4db5 100%)' }}>
          <div className="profile-avatar">
            {profileData?.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h1>{profileData?.name || 'User'}</h1>
          <p>{profileData?.email || 'No email provided'}</p>
          
          {/* Display LinkedIn profile link if available */}
          {profileData?.linkedinUrl && (
            <a 
              href={profileData.linkedinUrl.startsWith('http') ? profileData.linkedinUrl : `https://${profileData.linkedinUrl}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="linkedin-link"
            >
              <i className="fab fa-linkedin"></i> LinkedIn Profile
            </a>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="info-label">Full Name</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="name" 
                    value={editedData.name} 
                    onChange={handleInputChange} 
                    className="edit-input"
                  />
                ) : (
                  <span className="info-value">{profileData?.name || 'Not provided'}</span>
                )}
              </div>
              <div className="profile-info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{profileData?.email || 'Not provided'}</span>
              </div>
              
              {/* Add LinkedIn profile field */}
              <div className="profile-info-item">
                <span className="info-label">LinkedIn Profile</span>
                {isEditing ? (
                  <input 
                    type="url" 
                    name="linkedinUrl" 
                    value={editedData.linkedinUrl} 
                    onChange={handleInputChange} 
                    className="edit-input"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                  />
                ) : (
                  <span className="info-value">
                    {profileData?.linkedinUrl ? (
                      <a 
                        href={profileData.linkedinUrl.startsWith('http') ? profileData.linkedinUrl : `https://${profileData.linkedinUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {profileData.linkedinUrl}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </span>
                )}
              </div>
              
              <div className="profile-info-item">
                <span className="info-label">Phone</span>
                {isEditing ? (
                  <input 
                    type="tel" 
                    name="phone" 
                    value={editedData.phone} 
                    onChange={handleInputChange} 
                    className="edit-input"
                  />
                ) : (
                  <span className="info-value">{profileData?.contactNumber || 'Not provided'}</span>
                )}
              </div>
              <div className="profile-info-item">
                <span className="info-label">Date of Birth</span>
                {isEditing ? (
                  <input 
                    type="date" 
                    name="dob" 
                    value={editedData.dob} 
                    onChange={handleInputChange} 
                    className="edit-input"
                  />
                ) : (
                  <span className="info-value">{profileData?.dob || 'Not provided'}</span>
                )}
              </div>
              <div className="profile-info-item">
                <span className="info-label">Gender</span>
                {isEditing ? (
                  <select 
                    name="gender" 
                    value={editedData.gender} 
                    onChange={handleInputChange} 
                    className="edit-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <span className="info-value">{profileData?.gender || 'Not provided'}</span>
                )}
              </div>
              <div className="profile-info-item">
                <span className="info-label">Address</span>
                {isEditing ? (
                  <textarea 
                    name="address" 
                    value={editedData.address} 
                    onChange={handleInputChange} 
                    className="edit-input"
                  ></textarea>
                ) : (
                  <span className="info-value">{profileData?.address || 'Not provided'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Academic Information</h2>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="info-label">College</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="college" 
                    value={editedData.college} 
                    onChange={handleInputChange} 
                    className="edit-input"
                  />
                ) : (
                  <span className="info-value">{profileData?.graduationCollege || 'Not provided'}</span>
                )}
              </div>
              <div className="profile-info-item">
                <span className="info-label">Degree</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="degree" 
                    value={editedData.degree} 
                    onChange={handleInputChange} 
                    className="edit-input"
                  />
                ) : (
                  <span className="info-value">{profileData?.stream || 'Not provided'}</span>
                )}
              </div>
              <div className="profile-info-item">
                <span className="info-label">Major</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="major" 
                    value={editedData.major} 
                    onChange={handleInputChange} 
                    className="edit-input"
                  />
                ) : (
                  <span className="info-value">{profileData?.stream || 'Not provided'}</span>
                )}
              </div>
              <div className="profile-info-item">
                <span className="info-label">CGPA</span>
                {isEditing ? (
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="10" 
                    name="cgpa" 
                    value={editedData.cgpa} 
                    onChange={handleInputChange} 
                    className="edit-input"
                  />
                ) : (
                  <span className="info-value">{profileData?.cgpa || 'Not provided'}</span>
                )}
              </div>
              <div className="profile-info-item">
                <span className="info-label">Year of Graduation</span>
                {isEditing ? (
                  <input 
                    type="number" 
                    name="yearOfGraduation" 
                    value={editedData.yearOfGraduation} 
                    onChange={handleInputChange} 
                    className="edit-input"
                  />
                ) : (
                  <span className="info-value">{profileData?.yearOfGraduation || 'Not provided'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Skills</h2>
            {isEditing ? (
              <textarea
                name="skills"
                value={editedData.skills.join(', ')}
                onChange={(e) => setEditedData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
                className="edit-textarea"
                placeholder="Comma-separated skills"
              />
            ) : (
              <ul className="skills-list">
                {profileData?.skills?.length > 0 ? (
                  profileData.skills.map((skill, index) => <li key={index}>{skill}</li>)
                ) : (
                  <li>No skills provided</li>
                )}
              </ul>
            )}
          </div>

          <div className="profile-section">
            <h2>Experience</h2>
            {profileData?.experience?.length > 0 ? (
              profileData.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <h3>{exp.role} at {exp.company}</h3>
                  <p>{exp.duration}</p>
                </div>
              ))
            ) : (
              <p>No experience listed.</p>
            )}
          </div>

          <div className="profile-section">
            <h2>Projects</h2>
            {profileData?.projects?.length > 0 ? (
              profileData.projects.map((proj, index) => (
                <div key={index} className="project-item">
                  <h3>{proj.title}</h3>
                  <p>{proj.description}</p>
                  {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer">View Project</a>}
                </div>
              ))
            ) : (
              <p>No projects listed.</p>
            )}
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button 
                  className="save-profile-btn" 
                  onClick={handleSaveProfile}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving...' : 'Save Profile'}
                </button>
                <button className="cancel-edit-btn" onClick={handleEditToggle}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-profile-btn" onClick={handleEditToggle}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentProfile;