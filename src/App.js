// Add this import at the top of your file
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Register from "./components/Registeration/Register.js";
import AdminRegister from "./components/Registeration/AdminRegister.js";
import AdminLogin from "./components/Login/AdminLogin.js";
import StudentLogin from "./components/Login/StudentLogin.js";
import LandingPage from "./components/Login/LandingPage.js";
import Home from "./components/Home/Home.js";
import ForgetPassword from "./components/ForgotPassword/ForgetPassword.js";
import AddCompanies from "./components/Admin/Company-CRUD/AddCompanies.js";
import Companycrud from "./components/Admin/Company-CRUD/Companycrud.js";
import UpdateCompany from "./components/Admin/Company-CRUD/UpdateCompany.js";
import ResetPassword from "./components/ForgotPassword/ResetPassword.js";
import AdminDashboard from "./components/Admin/AdminReports/AdminDashboard.js";
import ViewerDashboard from "./components/Admin/AdminReports/ViewerDashboard.js";
import UserRoleManagement from "./components/Admin/AdminReports/UserRoleManagement.js";
import Admin from "./components/Admin/Admin.js";
import CompanyPage from "./components/Home/CompanyPages/CompanyPage.js";
import ScheduledInterview from "./components/Home/CompanyPages/ScheduledInterview.js";
import ScheduledInterviewData from "./components/Admin/AdminReports/ScheduledInterviewData.js";
import CompanyListing from "./components/Home/CompanyPages/CompanyListing.js";
import Faqspage from "./components/Home/FAQs/FaqPage.js";
import InterviewExperience from "./components/Home/InterviewExperiencePage/InterviewExperience.js";
import AddExperience from "./components/Home/InterviewExperiencePage/AddExperience.js";
import StudentProfile from './components/Home/HomeComponents/StudentProfile.js';
import StudentNavbar from "./components/Home/HomeComponents/Navbar.js";
import AdminNavbar from "./components/Admin/AdminReusableComponents/AdminNav.js";
import ViewerNavbar from "./components/Admin/AdminReusableComponents/ViewerNav.js";

function AppContent() {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  
  const hideNavbarRoutes = [
    "/",
    "/admin-login",
    "/student-login",
    "/register",
    "/admin/register",
    "/forgotpassword",
    "/resetPassword/:token"
  ];
  
  // Check for dynamic resetPassword route
  const isResetPassword = location.pathname.startsWith("/resetPassword");
  const showNavbar = !hideNavbarRoutes.includes(location.pathname) && !isResetPassword;

  // Use useEffect to listen for localStorage changes
  useEffect(() => {
    const checkUserRole = () => {
      const role = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
      setUserRole(role);
    };

    // Check initially
    checkUserRole();

    // Listen for storage events (when localStorage changes in other tabs)
    const handleStorageChange = () => {
      checkUserRole();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for changes
    const interval = setInterval(checkUserRole, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Determine which navbar to show
  let NavbarComponent = StudentNavbar;
  if (userRole === "admin") {
    NavbarComponent = AdminNavbar;
  } else if (userRole === "viewer") {
    NavbarComponent = ViewerNavbar;
  }

  return (
    <>
      {showNavbar && <NavbarComponent />}
      <div className={showNavbar ? "main-content with-navbar" : "main-content"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/companylisting" element={<CompanyListing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/viewerdashboard" element={<ViewerDashboard />} />
          <Route path="/userroles" element={<UserRoleManagement />} />
          <Route path="/add-companies" element={<AddCompanies />} />
          <Route path="/companies" element={<Companycrud />} />
          <Route path="/forgotpassword" element={<ForgetPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
          <Route path="/updatecompany/:id" element={<UpdateCompany />} />
          <Route path="/companypage/:id" element={<CompanyPage />} />
          <Route path="/scheduledInterview" element={<ScheduledInterview />} />
          <Route path="/scheduledInterviewdata" element={<ScheduledInterviewData />} />
          <Route path="/interviewexperience" element={<InterviewExperience />} />
          <Route path="/addexperience" element={<AddExperience />} />
          <Route path="/faq" element={<Faqspage />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
