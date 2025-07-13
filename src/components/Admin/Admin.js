import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from "./AdminHomeComponents/Home.js";
import About from "./AdminHomeComponents/About.js";
import Work from "./AdminHomeComponents/Work.js";
import Footer from "./AdminReusableComponents/AdminFooter.js";
import AdminNav from "./AdminReusableComponents/AdminNav.js";

function Admin() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
      </Routes>
      <Footer />
    </>
  )
}

export default Admin
