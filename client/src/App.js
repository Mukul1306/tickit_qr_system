import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AdminEventDetails from "./pages/AdminEventDetails";
// Removed VolunteerDashboard import as it was unused
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import Scanner from "./pages/Scanner";
import AdminEditEvent from "./pages/AdminEditEvent";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import SuperAdminLayout from "./pages/superadmin/SuperAdminLayout";
import DashboardOverview from "./pages/superadmin/DashboardOverview";
import UsersPage from "./pages/superadmin/UsersPage";
import EventsPage from "./pages/superadmin/EventsPage";
import SupportPage from "./pages/superadmin/SupportPage";
import CreateAd from "./pages/CreateAd";
import Footer from "./components/Footer";
import HowItWorks from "./pages/HowItWorks";
import HelpPage from "./pages/HelpPage";
import AdsPage from "./pages/superadmin/AdsPage";
 import MyOrders from "./pages/MyOrders";
import "./index.css";
import AdminAdsDashboard from "./pages/AdminAdsDashboard";
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
      } else if (role === "super_admin") {
        navigate("/super-admin");
      } else if (role === "volunteer") {
        navigate("/volunteer/dashboard"); // Or wherever volunteers should go
      } else {
        navigate("/");
      }
    }
  }, [location.pathname, navigate]); // Added dependencies to fix the warning

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
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-event" element={<CreateEvent />} />
        <Route path="/admin/edit/:id" element={<AdminEditEvent />} />   
        <Route path="/admin/event/:id" element={<AdminEventDetails />} />
<Route path="/admin/create-ad" element={<CreateAd />} />

        {/* Super Admin */}
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="events" element={<EventsPage />} />
        <Route path="ads" element={<AdsPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/admin/ads" element={<AdminAdsDashboard />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
 
      <Footer />
    </>
  );
}


export default App; 