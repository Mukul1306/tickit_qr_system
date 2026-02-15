import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./dashboard.css";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [ads, setAds] = useState([]);
  const [search, setSearch] = useState("");
  const [currentAd, setCurrentAd] = useState(0);
  const [visibleCount, setVisibleCount] = useState(10); // 👈 Only 10 first

  const navigate = useNavigate();
  

  const [trendingEvents, setTrendingEvents] = useState([]);

useEffect(() => {
  const fetchTrending = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/events/trending"
      );
      setTrendingEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchTrending();
}, []);

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/events?search=${search}`
      );
      setEvents(res.data);
    } catch (err) {
      console.error("Fetch Events Error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search]);

  // ================= FETCH ADS =================
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/ads/approved"
        );

        const topFive = res.data.slice(0, 5);
        setAds(topFive);

        // Track impressions
        topFive.forEach((ad) => {
          axios.put(
            `http://localhost:5000/api/ads/impression/${ad._id}`
          );
        });
      } catch (err) {
        console.error("Fetch Ads Error:", err);
      }
    };

    fetchAds();
  }, []);

  // ================= AUTO SLIDER =================
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAd((prev) =>
        prev === ads.length - 1 ? 0 : prev + 1
      );
    }, 3000); // 3 seconds (better UX)

    return () => clearInterval(interval);
  }, [ads]);

  // ================= CLICK TRACKING =================
  const handleAdClick = async (ad) => {
    try {
      await axios.put(
        `http://localhost:5000/api/ads/click/${ad._id}`
      );

      window.open(ad.redirectUrl, "_blank");
    } catch (err) {
      console.error("Ad Click Error:", err);
    }
  };
   const handleShowMore = () => {
    setVisibleCount(events.length); // 👈 Show all
  };
  return (
    <div className="dashboard-container">
 {/* search */}
            <div className="search-modern">
  <div className="search-box">
    <span className="search-icon">
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </span>
    <input
      type="text"
      placeholder="Search events by title or location..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <button className="search-btn-modern" onClick={fetchEvents}>
    Search
  </button>
</div>

      {/* ================= ADS SLIDER ================= */}
      {ads.length > 0 && (
        <div className="sponsored-container">
          <div
            className="sponsored-hero fade-slide"
            style={{
              backgroundImage: `url(${ads[currentAd].imageUrl})`,
            }}
            onClick={() => handleAdClick(ads[currentAd])}
          >
            <div className="sponsored-overlay">
              <span className="sponsored-label">SPONSORED</span>
              <h1 className="sponsored-title">
                {ads[currentAd].title}
              </h1>
              <button className="learn-btn">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      )}
         



               {trendingEvents.length > 0 && (
  <>
    

    <div className="events-grid">
      {trendingEvents.map((event) => (
        <div
          key={event._id}
          className="event-card trending-card"
          onClick={() => navigate(`/event/${event._id}`)}
        >
          <img src={event.imageUrl} alt={event.title} />
          <div className="event-content">
            <h3>{event.title}</h3>
            <p>{event.location}</p>
          </div>
        </div>
      ))}
    </div>
  </>
)}


              <h2 className="section-title">Upcoming Events</h2>
      <div className="events-grid">
        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="event-card"
              onClick={() =>
                navigate(`/event/${event._id}`)
              }
            >
              <img
                src={
                  event.imageUrl ||
                  "https://via.placeholder.com/400"
                }
                alt={event.title}
              />

              <div className="event-content">
                <h3>{event.title}</h3>
                <p>
                  {new Date(
                    event.date
                  ).toLocaleDateString()}{" "}
                  | {event.location}
                </p>
                <span>
                  {event.isPaid
                    ? `₹${event.price}`
                    : "Free"}
                </span>
              </div>
            </div>
          ))
        )}



      </div>

          {/* 👇 Show More Button */}
      {visibleCount < events.length && (
        <div className="show-more-wrapper">
          <button className="show-more-btn" onClick={handleShowMore}>
            Show More Events →
          </button>
        </div>
    )}

    <div className="stats-section">
      <div className="stat-box">
        <h3>10K+</h3>
        <p>Active Users</p>   
      </div>

      <div className="stat-box">
        <h3>200+</h3>
        <p>Events Hosted</p>
      </div>

      <div className="stat-box">
        <h3>50K+</h3>
        <p>Total Bookings</p>
      </div>

      <div className="stat-box">
        <h3>₹2M+</h3>
        <p>Revenue Generated</p>
      </div>
    </div>
  </div>
);
}

export default Dashboard;