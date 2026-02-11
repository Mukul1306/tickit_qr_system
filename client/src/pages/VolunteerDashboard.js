import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VolunteerDashboard() {

  const [availableEvents, setAvailableEvents] = useState([]);
  const [assignedEvents, setAssignedEvents] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    const allEvents = await axios.get(
      "http://localhost:5000/api/events"
    );

    const volunteerEvents = await axios.get(
      "http://localhost:5000/api/events/volunteer-events",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setAvailableEvents(allEvents.data);
    setAssignedEvents(volunteerEvents.data);
  };

  const requestEvent = async (eventId) => {
    await axios.post(
      `http://localhost:5000/api/events/request-volunteer/${eventId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert("Request Sent!");
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">

      <h1 className="text-3xl font-bold mb-8">
        Volunteer Dashboard
      </h1>

      {/* Assigned Events */}
      <h2 className="text-xl font-semibold mb-4">
        Approved Events
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {assignedEvents.map(event => (
          <div key={event._id} className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg">{event.title}</h3>
            <button
              onClick={() => navigate("/scanner")}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Go To Scanner
            </button>
          </div>
        ))}
      </div>

      {/* Available Events */}
      <h2 className="text-xl font-semibold mb-4">
        Available Events
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {availableEvents.map(event => (
          <div key={event._id} className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg">{event.title}</h3>
            <button
              onClick={() => requestEvent(event._id)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Request To Join
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default VolunteerDashboard;
