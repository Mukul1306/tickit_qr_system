import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="home-wrapper">
      <div className="content-container">
        
        {/* 1. IMMERSIVE HERO BANNER */}
        <div className="fest-hero-banner">
          <div className="hero-overlay">
            <div className="live-badge">● LIVE: 24H HACKATHON</div>
            <h1>Innovate the Future:<br/> TechFest 2026</h1>
            <button className="register-btn">Register Now</button>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d" 
            alt="Hackathon" 
            className="hero-img"
          />
        </div>

        {/* 2. CATEGORY PILLS */}
        <div className="category-row">
          <div className="pills-container">
            <button className="pill-item active">All Events</button>
            
          </div>

        </div>

        {/* 3. EVENT GRID */}
      
        <div className="fest-event-grid">
          {events.map(event => (
            <div 
              key={event._id} 
              className="fest-vertical-card"
              onClick={() => navigate(`/event/${event._id}`)}
            >
              <div className="card-top-area">
                <img src={event.imageUrl || "https://via.placeholder.com/400"} alt={event.title} />
                <span className="card-tag">{event.category || "Upcoming"}</span>
                <div className="card-bottom-info">
                   <h4>{event.title}</h4>
                   <p>📍 {event.location || "Main Hall"}</p>
                   <p>📅 {new Date(event.date).toLocaleDateString() || "Feb 20th"}</p>
                </div>
              </div>
              <div className="card-urgent-footer">
                 <div className="seats-warning">Register Now</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;