import React from "react";


function Footer() {
  return (
    <footer className="fest-footer">
      <div className="footer-container">
        
        {/* Top Section: Branding & Links */}
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">FEST<span>HUB</span></div>
            <p>The ultimate destination for college hackathons, cultural fests, and technical workshops.</p>
          </div>

          <div className="footer-links-group">
            <div className="footer-column">
              <h4>Explore</h4>
              <ul>
                <li>Hackathons</li>
                <li>DJ Nights</li>
                <li>Workshops</li>
                <li>Sports</li>
              </ul>
            </div>
            
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Bottom Section: Socials & Copyright */}
        <div className="footer-bottom">
          <p>© 2026 FestHub. All rights reserved.</p>
         
        </div>
      </div>
    </footer>
  );
}

export default Footer;