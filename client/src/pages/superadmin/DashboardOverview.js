import { useEffect, useState } from "react";
import axios from "axios";

function DashboardOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [events, setEvents] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
    fetchEventRegistrations();
  }, []);

const fetchStats = async () => {
  try {

    // 🔹 Existing stats
    const res = await axios.get(
      "http://localhost:5000/api/super-admin/stats",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔹 NEW: Total Revenue API
    const revenueRes = await axios.get(
      "http://localhost:5000/api/events/superadmin/total-revenue",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setStats({
      ...res.data,
      totalRevenue: revenueRes.data.totalRevenue
    });

  } catch (err) {
    console.log(err);
  }
};
  // 🔹 Fetch registrations per event
  const fetchEventRegistrations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/events/superadmin/stats",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(res.data);
    } catch (err) {
      console.log("REGISTRATION ERROR:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Overview</h1>

      {/* ================= STATS ================= */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Total Events</h3>
          <p>{stats.totalEvents}</p>
        </div>

        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>₹ {stats.totalRevenue}</p>
        </div>
      </div>

      {/* ================= EVENT REGISTRATIONS ================= */}
      <h2 style={{ marginTop: "40px" }}>Event Registrations</h2>

      {events.length === 0 ? (
        <p>No data available</p>
      ) : (
        events.map((event) => (
          <div
            key={event._id}
            className="event-card-admin"
            style={{
              background: "#fff",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h3>{event.title}</h3>
            <p>📍 {event.location}</p>
            <p>📝 Total Registrations: {event.totalRegistrations}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default DashboardOverview;