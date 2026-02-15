import { useEffect, useState } from "react";
import axios from "axios";

function SupportPage() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/help/all",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRequests(res.data);
  };

  return (
    <div>
      <h1>Support Requests</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Subject</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((r) => (
            <tr key={r._id}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td>{r.role}</td>
              <td>{r.subject}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupportPage;