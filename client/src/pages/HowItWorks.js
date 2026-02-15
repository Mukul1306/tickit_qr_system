import React from "react";
import "./howItWorks.css";

function HowItWorks() {
  return (
    <div className="how-container">

      <h1 className="main-title">How FestHub Works</h1>
      <p className="subtitle">
        A simple guide for Users, Event Admins and Volunteers
      </p>

      <div className="role-grid">

        {/* USER */}
        <div className="role-card">
          <div className="role-icon">🎟️</div>
          <h2>User</h2>
          <ul>
            <li>🔎 Search and explore events</li>
            <li>📝 Fill event registration form</li>
            <li>📲 Receive QR code ticket instantly</li>
            <li>🎉 Show QR at event entry</li>
          </ul>
        </div>

        {/* ADMIN */}
        <div className="role-card">
          <div className="role-icon">🛠️</div>
          <h2>Event Admin</h2>
          <ul>
            <li>📅 Create and manage events</li>
            <li>➕ Add custom form fields</li>
            <li>👥 Approve volunteer requests</li>
            <li>📊 Download attendee reports</li>
          </ul>
        </div>

        {/* VOLUNTEER */}
        <div className="role-card">
          <div className="role-icon">🤝</div>
          <h2>Volunteer</h2>
          <ul>
            <li>📌 Request to join events</li>
            <li>✅ Get approval from admin</li>
            <li>📱 Scan QR codes at entry</li>
            <li>🎯 Help manage participants</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default HowItWorks;