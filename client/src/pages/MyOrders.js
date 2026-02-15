import { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
function MyOrders() {

  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bookings/my-bookings",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
 <div className="tickets-container">
  <h1 className="tickets-title">🎟 My Tickets</h1>

  {bookings.length === 0 ? (
    <p className="no-ticket">No tickets booked yet.</p>
  ) : (
    bookings.map((ticket) => (
      <div key={ticket._id} className="ticket-card">

        {/* Left Side */}
        <div className="ticket-left">
          <h2>{ticket.eventId?.title}</h2>

          <p>📍 {ticket.eventId?.location}</p>
          <p>📅 {new Date(ticket.eventId?.date).toLocaleDateString()}</p>

          <p className="booking-date">
            Booked on: {new Date(ticket.createdAt).toLocaleDateString()}
          </p>

          <p className="booking-id">
            Booking ID: {ticket.bookingId}
          </p>
        </div>

        {/* Right Side QR */}
        <div className="ticket-right">
          <img src={ticket.qrCode} alt="QR Code" />
          <p className="scan-text">Scan at entry</p>
        </div>

      </div>
    ))
  )}
</div>
  );
}

export default MyOrders;