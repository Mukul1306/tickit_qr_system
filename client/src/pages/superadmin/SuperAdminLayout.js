import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./superadmin.css";

function SuperAdminLayout() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "super_admin") {
      navigate("/");
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="superadmin-wrapper">

      <aside className="sidebar">
        <h2>👑 Super Admin</h2>

        <Link to="/super-admin">Dashboard</Link>
        <Link to="/super-admin/users">Users</Link>
        <Link to="/super-admin/ads">Ads</Link>
        <Link to="/super-admin/events">Events</Link>
        <Link to="/super-admin/support">Support</Link>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default SuperAdminLayout;