import { useEffect, useState } from "react";
import axios from "axios";
import "./superadmin.css";

function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await axios.get(
        "http://localhost:5000/api/super-admin/stats",
        config
      );

      const usersRes = await axios.get(
        "http://localhost:5000/api/super-admin/users",
        config
      );

      const eventsRes = await axios.get(
        "http://localhost:5000/api/events/super/all-events",
        config
      );

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ================= USER ACTIONS =================

  const suspendUser = async (id) => {
    await axios.put(
      `http://localhost:5000/api/super-admin/suspend-user/${id}`,
      {},
      config
    );
    fetchData();
  };

  const reactivateUser = async (id) => {
    await axios.put(
      `http://localhost:5000/api/super-admin/reactivate-user/${id}`,
      {},
      config
    );
    fetchData();
  };

  const deleteUser = async (id, role) => {
    if (role === "super_admin") {
      alert("Cannot delete Super Admin");
      return;
    }

    await axios.delete(
      `http://localhost:5000/api/super-admin/delete-user/${id}`,
      config
    );
    fetchData();
  };

  // ================= EVENT ACTIONS =================

  const approveEvent = async (id) => {
    await axios.put(
      `http://localhost:5000/api/events/super/update-status/${id}`,
      { status: "approved" },
      config
    );
    fetchData();
  };

  const rejectEvent = async (id) => {
    await axios.put(
      `http://localhost:5000/api/events/super/update-status/${id}`,
      { status: "rejected" },
      config
    );
    fetchData();
  };

  const deleteEvent = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/events/super/delete/${id}`,
      config
    );
    fetchData();
  };

  return (
    <div className="superadmin-container">
      <h1>👑 Super Admin Dashboard</h1>

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

      {/* ================= USERS ================= */}
      <h2>All Users</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.isSuspended ? (
                  <span className="badge red">Suspended</span>
                ) : (
                  <span className="badge green">Active</span>
                )}
              </td>
              <td>
                {u.role !== "super_admin" && (
                  <div className="action-buttons">
                    {u.isSuspended ? (
                      <button
                        className="btn green"
                        onClick={() => reactivateUser(u._id)}
                      >
                        Reactivate
                      </button>
                    ) : (
                      <button
                        className="btn yellow"
                        onClick={() => suspendUser(u._id)}
                      >
                        Suspend
                      </button>
                    )}

                    <button
                      className="btn red"
                      onClick={() => deleteUser(u._id, u.role)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= EVENTS ================= */}
      <h2>All Events</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Location</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {events.map((e) => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>
                <span
                  className={
                    e.status === "approved"
                      ? "badge green"
                      : "badge yellow"
                  }
                >
                  {e.status}
                </span>
              </td>
              <td>{e.location}</td>
              <td>{e.isPaid ? `₹ ${e.price}` : "Free"}</td>

              <td>
                <div className="action-buttons">
                  {e.status !== "approved" && (
                    <button
                      className="btn green"
                      onClick={() => approveEvent(e._id)}
                    >
                      Approve
                    </button>
                  )}

                  <button
                    className="btn red"
                    onClick={() => deleteEvent(e._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SuperAdminDashboard;