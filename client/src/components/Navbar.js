import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const close = () => setProfileOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <nav className="fest-navbar">
      <div className="navbar-inner">

        {/* LOGO */}
        <div className="nav-logo" onClick={() => navigate("/")}>
          FEST<span>HUB</span>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="nav-links">

          <div className="nav-item" onClick={() => navigate("/")}>Home</div>
          <div className="nav-item" onClick={() => navigate("/how-it-works")}>How It Works</div>
          <div className="nav-item" onClick={() => navigate("/help")}>Help</div>

          {role === "user" && (
            <div className="nav-item" onClick={() => navigate("/my-orders")}>
              My Orders
            </div>
          )}

          {role === "event_admin" && (
            <div className="nav-item" onClick={() => navigate("/admin/dashboard")}>
              Admin
            </div>
          )}

          {role === "super_admin" && (
            <div className="nav-item" onClick={() => navigate("/super-admin")}>
              Super Admin
            </div>
          )}

     

        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">

          {!name ? (
            <div className="auth-btns">
              <button className="login-link" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="signup-btn-nav" onClick={() => navigate("/register")}>
                Sign Up
              </button>
            </div>
          ) : (
            <div
              className="profile-wrapper"
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen(!profileOpen);
              }}
            >
              <div className="profile-avatar-nav">
                {name.charAt(0).toUpperCase()}
              </div>

              {profileOpen && (
                <div className="profile-dropdown-menu">
                  <div className="user-info-header">
                    <p className="user-name">{name}</p>
                    <p className="user-role">{role?.replace("_", " ")}</p>
                  </div>
                  <hr />
                  <button className="logout-btn" onClick={logout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>

    

        <div onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</div>
        <div onClick={() => { navigate("/how-it-works"); setMenuOpen(false); }}>How It Works</div>
        <div onClick={() => { navigate("/help"); setMenuOpen(false); }}>Help</div>

        {role === "user" && (
          <div onClick={() => { navigate("/my-orders"); setMenuOpen(false); }}>
            My Orders
          </div>
        )}

        {role === "event_admin" && (
          <div onClick={() => { navigate("/admin/dashboard"); setMenuOpen(false); }}>
            Admin Dashboard
          </div>
        )}

        {role === "super_admin" && (
          <div onClick={() => { navigate("/super-admin"); setMenuOpen(false); }}>
            Super Admin
          </div>
        )}

        {!name && (
          <>
            <div onClick={() => { navigate("/login"); setMenuOpen(false); }}>
              Login
            </div>
            <div onClick={() => { navigate("/register"); setMenuOpen(false); }}>
              Register
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;