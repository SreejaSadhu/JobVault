import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Registeration-CSS/RegistrationPage.css"; // Updated CSS file name

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repass, setRpass] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [sapId, setSapId] = useState("");
  const [tenthPercentage, setTenthPercentage] = useState("");
  const [tenthSchool, setTenthSchool] = useState("");
  const [twelfthPercentage, setTwelfthPercentage] = useState("");
  const [twelfthCollege, setTwelfthCollege] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [stream, setStream] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== repass) {
      alert("Passwords do not match");
      return;
    }
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      alert(
        "Password should contain at least one uppercase, one lowercase, one special character, and one number, with a minimum length of 8 characters."
      );
      return;
    }

    if (
      !name ||
      !email ||
      !password ||
      !repass ||
      !contactNumber ||
      !sapId ||
      !tenthPercentage ||
      !tenthSchool ||
      !twelfthPercentage ||
      !twelfthCollege ||
      !cgpa ||
      !stream ||
      !dob
    ) {
      alert("Please fill in all fields");
      return;
    }

    const userData = {
      name,
      email,
      password,
      contactNumber,
      sapId,
      tenthPercentage,
      tenthSchool,
      twelfthPercentage,
      twelfthCollege,
      cgpa,
      stream,
      dob,
      isAdmin: null,
    };
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, userData)
      .then((result) => {
        console.log(result);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const handleStreamChange = (e) => {
    setStream(e.target.value);

    setCgpa("");
  };

  return (
    <div className="registration-background">
      <div className="registration-container">
        <h1>Create Your Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="repass">Re-enter Password</label>
              <input
                type="password"
                id="repass"
                className="form-control"
                onChange={(e) => setRpass(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tenthPercentage">10th Percentage</label>
              <input
                type="number"
                id="tenthPercentage"
                className="form-control"
                step="0.01"
                onChange={(e) => setTenthPercentage(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tenthSchool">10th School Name</label>
              <input
                type="text"
                id="tenthSchool"
                className="form-control"
                onChange={(e) => setTenthSchool(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="twelfthPercentage">12th Percentage</label>
              <input
                type="number"
                id="twelfthPercentage"
                className="form-control"
                step="0.01"
                onChange={(e) => setTwelfthPercentage(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="twelfthCollege">12th College Name</label>
              <input
                type="text"
                id="twelfthCollege"
                className="form-control"
                onChange={(e) => setTwelfthCollege(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stream">Stream</label>
              <select
                id="stream"
                className="form-control"
                onChange={(e) => setStream(e.target.value)}
              >
                <option value="">Select Stream</option>
                <option value="MCA">MCA</option>
                <option value="Btech-IT">Btech-IT</option>
                <option value="Btech-CS">Btech-CS</option>
                <option value="Btech-Cybersecurity">Btech-Cybersecurity</option>
                <option value="Btech-Data Science">Btech-Data Science</option>
                <option value="Btech-Mechatronics">Btech-Mechatronics</option>
                <option value="Btech-EXTC">Btech-Extc</option>
                <option value="BTech-Integrated">BTech-Integrated</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cgpa">CGPA</label>
              <input
                type="number"
                id="cgpa"
                step="0.01"
                className="form-control"
                onChange={(e) => setCgpa(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="number"
                id="contactNumber"
                className="form-control"
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="sapId">Sap ID</label>
              <input
                type="text"
                id="sapId"
                className="form-control"
                onChange={(e) => setSapId(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              className="form-control"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>
        <div className="login-link">
          <p>
            Already have an account?{" "}
            <Link to="/" className="link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registration;
