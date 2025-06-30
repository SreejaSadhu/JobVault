import { useState } from "react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Admin-CSS/AddCompanies.css";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import AddCompany from '../Assets/AddCompany.png'
function AddCompanies() {
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/verify`).then((res) => {
      if (res.data.status) {
        console.log("Admin verified successfully");
      } else {
        console.log("Admin verification failed, redirecting to login");
        navigate("/");
      }
    }).catch((err) => {
      console.error("Admin verification error:", err);
      navigate("/");
    });
  }, []);
  const [companyname, setCompanyName] = useState("");
  const [jobprofile, setJobProfile] = useState("");
  const [jobdescription, setJobDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [ctc, setCtc] = useState("");
  const [doi, setDoi] = useState("");
  const [tenthPercentage, setTenthPercentage] = useState("");
  const [twelfthPercentage, setTwelfthPercentage] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [branches, setBranches] = useState([]);

  const navigate = useNavigate();
  const handleBranchChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setBranches((prevBranches) => [...prevBranches, value]);
    } else {
      setBranches((prevBranches) =>
        prevBranches.filter((branch) => branch !== value)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !companyname ||
      !jobprofile ||
      !jobdescription ||
      !website ||
      !doi ||
      !tenthPercentage ||
      !ctc ||
      !twelfthPercentage
    ) {
      alert("Please fill in all fields");
      return;
    }

    const CompanyData = {
      companyname,
      jobprofile,
      jobdescription,
      website,
      ctc,
      doi,
      eligibilityCriteria: branches,
      tenthPercentage,
      twelfthPercentage,
      cgpa,
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/auth/add-companies`, CompanyData)
      .then((result) => {
        console.log(result);
        navigate("/companies");
      })
      .catch((err) => {
        console.error("Error submitting data:", err);
      });
  };

  return (
    <>
      <AdminHome />
      <h1 style={{ marginTop: '90px', color: 'rgba(85,107,247,255)' }}>Add Companies</h1>
      <div className="container-fluid h-100">
        <div className="row h-100 justify-content-center align-items-start">
          <div className="col-lg-4 d-flex justify-content-center align-items-center" style={{ minHeight: '400px', marginTop: '120px' }}>
            <img src={AddCompany} alt="Add Company" className="img-fluid" style={{ maxWidth: '120%', maxHeight: '120%', marginLeft: '100px' }} />
          </div>
          <div className="col-lg-8 d-flex justify-content-center align-items-center custom-border">
            <div className="form-container">
              <div className="card" style={{ maxWidth: "100vh", width: "900%" }}>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>
                            <div className="form-group">
                              <label htmlFor="name">Company Name</label>
                              <input
                                type="text"
                                id="name"
                                className="form-control"
                                placeholder="Company Name"
                                onChange={(e) => setCompanyName(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="jobprofile">Job Profile</label>
                              <input
                                type="text"
                                id="jobprofile"
                                className="form-control"
                                placeholder="Job Profile"
                                onChange={(e) => setJobProfile(e.target.value)}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-group">
                              <label htmlFor="jobdescription">Job Description</label>
                              <textarea
                                id="jobdescription"
                                className="form-control textarea"
                                placeholder="Job Description"
                                onChange={(e) => setJobDescription(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="website">Company Website</label>
                              <input
                                type="website"
                                id="website"
                                className="form-control"
                                placeholder="Company Website"
                                onChange={(e) => setWebsite(e.target.value)}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-group">
                              <label htmlFor="ctc">Offered CTC</label>
                              <input
                                type="number"
                                id="ctc"
                                className="form-control"
                                placeholder="Offered CTC"
                                onChange={(e) => setCtc(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="interviewdate">Interview Date</label>
                              <input
                                type="date"
                                id="interviewdate"
                                className="form-control"
                                onChange={(e) => setDoi(e.target.value)}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h4 className="mb-3">Eligibility Criteria</h4>
                            <div className="form-group">
                              <label htmlFor="tenthPercentage">10th Percentage</label>
                              <input
                                type="number"
                                id="tenthPercentage"
                                className="form-control"
                                placeholder="10th Percentage"
                                onChange={(e) => setTenthPercentage(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="twelfthPercentage">12th Percentage</label>
                              <input
                                type="number"
                                id="twelfthPercentage"
                                className="form-control"
                                placeholder="12th Percentage"
                                onChange={(e) => setTwelfthPercentage(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="cgpa">Minimum CGPA</label>
                              <input
                                type="number"
                                step="0.01"
                                id="cgpa"
                                className="form-control"
                                placeholder="Minimum CGPA"
                                onChange={(e) => setCgpa(e.target.value)}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h4 className="mb-3">Eligible Branches</h4>
                            <div className="form-group">
                              <label htmlFor="MCA">
                                <input type="checkbox" id="MCA" value="MCA" onChange={handleBranchChange} /> MCA
                              </label>
                            </div>
                            <div className="form-group">
                              <label htmlFor="BTECH-IT">
                                <input type="checkbox" id="BTECH-IT" value="BTECH-IT" onChange={handleBranchChange} /> Btech-IT
                              </label>
                            </div>
                            <div className="form-group">
                              <label htmlFor="BTECH-CS">
                                <input type="checkbox" id="BTECH-CS" value="BTECH-CS" onChange={handleBranchChange} /> Btech-CS
                              </label>
                            </div>
                            <div className="form-group">
                              <label htmlFor="BTECH-CYBERSECURITY">
                                <input type="checkbox" id="BTECH-CYBERSECURITY" value="BTECH-CYBERSECURITY" onChange={handleBranchChange} /> Btech-Cybersecurity
                              </label>
                            </div>
                            <div className="form-group">
                              <label htmlFor="BTECH-DATA SCIENCE">
                                <input type="checkbox" id="BTECH-DATA SCIENCE" value="BTECH-DATA SCIENCE" onChange={handleBranchChange} /> Btech-Data Science
                              </label>
                            </div>
                            <div className="form-group">
                              <label htmlFor="BTECH-INTEGRATED">
                                <input type="checkbox" id="BTECH-INTEGRATED" value="BTECH-INTEGRATED" onChange={handleBranchChange} /> Btech-Integrated
                              </label>
                            </div>
                            <div className="form-group">
                              <label htmlFor="BTECH-MECHATRONICS">
                                <input type="checkbox" id="BTECH-MECHATRONICS" value="BTECH-MECHATRONICS" onChange={handleBranchChange} /> Btech-Mechatronics
                              </label>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'rgba(85,107,247,255)' }}>
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AddCompanies;
