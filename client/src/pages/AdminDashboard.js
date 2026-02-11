import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/events/admin-events",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

const deleteEvent = async (id) => {
  try {
  await axios.delete(
  `http://localhost:5000/api/events/delete/${id}`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

    fetchEvents();
  } catch (err) {
    console.log(err);
    alert("Delete failed");
  }
};


  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white p-10">
     

      <h1 className="text-3xl font-bold text-blue-500 mb-8">
        My Events
      </h1>

      <button
        onClick={() => navigate("/admin/create-event")}
        className="mb-8 bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        + Create Event
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          events.map((event) => {
            const totalRegistered =
              event.totalSeats - event.availableSeats;

            const revenue = event.isPaid
              ? totalRegistered * event.price
              : 0;

            return (
              <div
                key={event._id}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <img
                  src={event.imageUrl}
                  alt=""
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />

                <h3 className="text-xl font-bold">{event.title}</h3>

                <p className="text-gray-500 mt-2">
                  Seats Left: {event.availableSeats}
                </p>

                <p className="text-gray-500">
                  Total Registered: {totalRegistered}
                </p>

                {event.isPaid && (
                  <p className="text-green-600 font-semibold">
                    Revenue: ₹ {revenue}
                  </p>
                )}

                <div className="flex gap-3 mt-6">

 <button
  type="button"
  onClick={() => navigate(`/admin/event/${event._id}`)}
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
>
  View Members
</button>

  <button
    onClick={() => navigate(`/admin/edit/${event._id}`)}
    className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg cursor-pointer"
  >
    Edit
  </button>

  <button
    onClick={() => deleteEvent(event._id)}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer"
  >
    Delete
  </button>

</div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;
