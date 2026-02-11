import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AdminEventDetails from "./pages/AdminEventDetails";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import Scanner from "./pages/Scanner";
import AdminEditEvent from "./pages/AdminEditEvent";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Footer from "./components/Footer";

import "./index.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return;

  // Only redirect if on login or register page
  if (location.pathname === "/login" || location.pathname === "/register") {

    if (role === "event_admin") {
      navigate("/admin/dashboard");
    } 
     else if (role === "super_admin") {
    navigate("/super-admin/dashboard");
  }
    else if (role === "volunteer") {
      navigate("/volunteer/dashboard");
    } 
    if (role === "super_admin") {
  navigate("/super-admin/dashboard");
}
    else {
      navigate("/");
    }

  }

} , []);


  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event/:id" element={<EventDetails />} />

        {/* Volunteer */}
        <Route path="/scanner" element={<Scanner />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-event" element={<CreateEvent />} />
        <Route path="/admin/edit/:id" element={<AdminEditEvent />} />

        {/* You can later add super admin route here */}
        {/* <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} /> */}
         <Route path="/admin/event/:id" element={<AdminEventDetails />} />
         <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
         <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />


      </Routes>
       <Footer />
    </>
  );
}

export default App;
