import { useEffect, useState } from "react";
import axios from "axios";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/events/super/all-events",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEvents(res.data);
  };

  const approveEvent = async (id) => {
    await axios.put(
      `http://localhost:5000/api/events/super/update-status/${id}`,
      { status: "approved" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/events/super/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchEvents();
  };

  const toggleTrending = async (id) => {
    await axios.put(
      `http://localhost:5000/api/events/super/toggle-trending/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchEvents();
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>All Events</h1>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Location</th>
            <th>Trending</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {events.map((e) => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>{e.status}</td>
              <td>{e.location}</td>

              <td>
                {e.isTrending ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    🔥 Trending
                  </span>
                ) : (
                  <span style={{ color: "gray" }}>
                    Not Trending
                  </span>
                )}
              </td>

              <td style={{ display: "flex", gap: "8px" }}>
                {e.status !== "approved" && (
                  <button
                    onClick={() => approveEvent(e._id)}
                    style={approveBtn}
                  >
                    Approve
                  </button>
                )}

                <button
                  onClick={() => toggleTrending(e._id)}
                  style={
                    e.isTrending
                      ? removeTrendingBtn
                      : trendingBtn
                  }
                >
                  {e.isTrending
                    ? "Remove Trending"
                    : "Keep Trending"}
                </button>

                <button
                  onClick={() => deleteEvent(e._id)}
                  style={deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= STYLES ================= */

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px"
};

const approveBtn = {
  background: "#22c55e",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const trendingBtn = {
  background: "#f97316",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const removeTrendingBtn = {
  background: "#6b7280",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default EventsPage;