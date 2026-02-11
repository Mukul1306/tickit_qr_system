import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
 // Ensure you create this CSS file

function Navbar() {
  const navigate = useNavigate();
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
        
        {/* Aesthetic Logo */}
        <div className="nav-logo" onClick={() => navigate("/")}>
          FEST<span>HUB</span>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <div className="nav-item" onClick={() => navigate("/")}>Home</div>
          
          {role === "event_admin" && (
            <div className="nav-item" onClick={() => navigate("/admin/dashboard")}>
              Admin
            </div>
          )}
          
          {role === "super_admin" && (
            <div className="nav-item" onClick={() => navigate("/super-admin/dashboard")}>
              Super Admin
            </div>
          )}
        </div>

        {/* Right Side: Auth & Profile */}
        <div className="nav-right">
          {!name ? (
            <div className="auth-btns">
              <button className="login-link" onClick={() => navigate("/login")}>Login</button>
              <button className="signup-btn-nav" onClick={() => navigate("/register")}>Sign Up</button>
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
                  <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</div>
        {role === "event_admin" && (
          <div onClick={() => { navigate("/admin/dashboard"); setMenuOpen(false); }}>Admin Dashboard</div>
        )}
        {!name && (
          <>
            <div onClick={() => { navigate("/login"); setMenuOpen(false); }}>Login</div>
            <div onClick={() => { navigate("/register"); setMenuOpen(false); }}>Register</div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;