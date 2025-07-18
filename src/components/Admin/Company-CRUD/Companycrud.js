import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, deleteCompany } from "../../../redux/companySlice.jsx";
import AdminHome from "../AdminHome.js";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import interviewimg from '../Assets/company.png'
import "../Admin-CSS/Companycrud.css";
function Companycrud() {

  const navigate=useNavigate()
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
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);
  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/auth/deletecompany/` + id)
      .then((res) => {
        dispatch(deleteCompany({ id }));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/getCompanies`
        );
        dispatch(getCompanies(response.data));
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  const userRole = localStorage.getItem("userRole");
  return (
    <>
      {userRole === 'viewer' && (
        <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ color: '#856404', margin: 0 }}>View-Only Mode - Viewer Access</h3>
          <p style={{ color: '#856404', margin: '5px 0 0 0' }}>You can view all companies but cannot make changes.</p>
        </div>
      )}
      <AdminHome />
      <h2 className="header-title">Companies</h2>
      <div className="container-fluid h-100">
        <div className="row h-100 justify-content-center align-items-start">
          <div className="col-lg-4 d-flex justify-content-center align-items-center" style={{ height: 'fit-content' }}>
            <img src={interviewimg} alt="Your Image" className="img-fluid" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          </div>
          <div className="col-lg-8 d-flex justify-content-center align-items-center custom-border">
            <div className="bg-white rounded p-4">
              {userRole !== 'viewer' && (
                <Link to="/add-companies" className="btn btn-success btn-sm mb-3 btn-add">
                  Add +
                </Link>
              )}
              <table className="table table-bordered">
                <thead className="bg-purple text-white">
                  <tr>
                    <th>Name</th>
                    <th>Profile</th>
                    <th>Package</th>
                    <th>Interview Date</th>
                    <th>Branch</th>
                    <th>10th %</th>
                    <th>12th %</th>
                    <th>Graduation CGPA</th>
                    <th>6th Semester CGPA</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => {
                    return (
                      <tr key={company.id}>
                        <td>{company.companyname}</td>
                        <td>{company.jobprofile}</td>
                        <td>{company.ctc}</td>
                        <td>{company.doi}</td>
                        <td>{company.eligibilityCriteria ? company.eligibilityCriteria.join(", ") : ""}</td>
                        <td>{company.tenthPercentage}</td>
                        <td>{company.twelfthPercentage}</td>
                        <td>{company.graduationCGPA}</td>
                        <td>{company.sixthSemesterCGPA}</td>
                        <td>
                          {userRole !== 'viewer' && (
                            <>
                              <Link to={`/updatecompany/${company.id}`} className="btn btn-sm btn-success">
                                Update
                              </Link>
                              <button onClick={() => handleDelete(company.id)} className="btn btn-sm btn-danger">
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Companycrud;
