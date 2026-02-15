import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./eventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customResponses, setCustomResponses] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    collegeId: "",
    collegeName: "",
    location: "",
    linkedin: "",
  });

  // ==============================
  // Fetch Single Event
  // ==============================
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/events/${id}`
        );
        setEvent(res.data);
        setCustomResponses(
  res.data.customFields?.map(field => ({
    label: field.label,
    value: ""
  })) || []
);
      } catch (err) {
        console.log("Error fetching event");
      }
    };

    fetchEvent();
  }, [id]);


const handlePayment = async () => {

  try {

    // 🔥 STEP 1: VALIDATE FIRST
    const validationRes = await axios.post(
      `http://localhost:5000/api/bookings/validate/${event._id}`,
      { quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // If backend returns error → it will throw
    // If success → continue

    if (!event.isPaid) {
      await axios.post(
        `http://localhost:5000/api/bookings/create/${event._id}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Free ticket booked successfully!");
      return;
    }

    // 🔥 STEP 2: CREATE ORDER
    const orderRes = await axios.post(
      `http://localhost:5000/api/payment/create-order/${event._id}`,
      { quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { order } = orderRes.data;

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "EventHub",
      order_id: order.id,
handler: async function (response) {

  try {

    const verifyRes = await axios.post(
      "http://localhost:5000/api/payment/verify-payment",
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        eventId: event._id,
        quantity ,
       
         name : form.name,
         email : form.email,
         age : form.age,
          collegeId : form.collegeId,
          collegeName : form.collegeName,
          location : form.location,
          linkedin : form.linkedin,
          customResponses


      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const bookingData = verifyRes.data.booking;

    setBooking(bookingData);     // 🔥 save booking
    setQr(bookingData.qrCode);   // 🔥 save QR
    setShowModal(true);          // 🔥 open ticket modal

    alert("Payment successful 🎉");

  } catch (error) {
    alert("Payment verification failed");
  }
}};

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
  }
};
  // ==============================
  // Book Ticket
  // ==============================
  const bookTicket = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "user") {
      alert("Only users can book.");
      return;
    }

    if (event.availableSeats <= 0) {
      alert("No seats available");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:5000/api/bookings/create/${id}`,
        {
          ...form,
          customResponses
        },
        
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setQr(res.data.qrCode);
      setShowModal(true);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  // ==============================
  // Download Ticket (Professional)
  // ==============================
  const downloadTicket = () => {

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: [100, 150]
    });

    // Red Header
    doc.setFillColor(248, 68, 100);
    doc.rect(0, 0, 100, 25, "F");

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("EventHub", 10, 15);

    // White Body
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 25, 100, 125, "F");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);

    const title =
      event.title.length > 35
        ? event.title.substring(0, 35) + "..."
        : event.title;

    doc.text(title, 10, 40);

    // QR
    if (qr) {
      doc.addImage(qr, "PNG", 25, 50, 50, 50);
    }

    // Divider
    doc.setLineDash([2, 2]);
    doc.line(5, 105, 95, 105);
    doc.setLineDash([]);

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("ATTENDEE DETAILS", 10, 115);

    doc.setFontSize(10);
    doc.setTextColor(0);

    doc.text(`Name: ${form.name}`, 10, 123);
    doc.text(`Email: ${form.email}`, 10, 130);
    doc.text(`College: ${form.collegeName}`, 10, 137);
    doc.text(`Age: ${form.age}`, 10, 144);
    doc.text(`Seat Qty: ${quantity}`, 10, 151);

    doc.setTextColor(248, 68, 100);
    doc.text(
      `📍 ${event.location} | 📅 ${event.date || "2026"}`,
      10,
      145
    );

    doc.save(`Ticket_${form.name}.pdf`);
  };

  if (!event) {
    return <div className="loading">Loading event...</div>;
  }

  return (
    <div className="event-page">

      {/* Banner */}
      <div className="event-banner">
        <img src={event.imageUrl} alt={event.title} />
      </div>

      <div className="event-container">

        {/* LEFT */}
        <div className="event-info">
          <h1>{event.title}</h1>
          <p className="event-location">📍 {event.location}</p>

          <div className="event-meta">
            <span className="price">
              {event.isPaid ? `₹ ${event.price}` : "Free"}
            </span>
            <span className="seats">
              {event.availableSeats} seats left
            </span>
          </div>

          <div className="event-description">
            <h3>About Event</h3>
            <p>{event.description}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="booking-card">
          <h2>Book Your Seat</h2>

        <form onSubmit={bookTicket}>

  {/* Default Fields */}
  <input
    type="text"
    placeholder="Full Name"
    required
    onChange={(e) =>
      setForm({ ...form, name: e.target.value })
    }
  />

  <input
    type="email"
    placeholder="Email"
    required
    onChange={(e) =>
      setForm({ ...form, email: e.target.value })
    }
  />

  <input
    type="number"
    placeholder="Age"
    required
    onChange={(e) =>
      setForm({ ...form, age: e.target.value })
    }
  />
  
  <input
    type="text"
    placeholder="College Name"
    required
    onChange={(e) =>
      setForm({ ...form, collegeName: e.target.value })
    }
  />
  <input
    type="text"   
    placeholder="College ID"
    required
    onChange={(e) =>
      setForm({ ...form, collegeId: e.target.value })
    }
  />

  <input
    type="text" 
    placeholder="Location"
    required
    onChange={(e) =>
      setForm({ ...form, location: e.target.value })
    }
  />

  <input
  type="number"
  placeholder="Seat Quantity"
  min="1"
  max={event.isPaid ? 4 : 2}
  value={quantity}
  onChange={(e) => setQuantity(e.target.value)}
/>

  {/* 🔥 CUSTOM FIELDS FROM ADMIN */}
  {event.customFields?.map((field, index) => (
    <input
      key={index}
      type={field.type}
      placeholder={field.label}
      required={field.required}
      onChange={(e) => {
        const updated = [...customResponses];
        updated[index].value = e.target.value;
        setCustomResponses(updated);
      }}
    />
  ))}


<button type="button" onClick={handlePayment}>
  Pay & Book
</button>

</form>
        </div>
      </div>

      {/* Ticket Modal */}
      {showModal && (
        <div className="ticket-overlay">
          <div className="modern-ticket">

            <div className="ticket-header">
              <h3>EventHub</h3>
            </div>

            <div className="ticket-body">
              <h1 className="ticket-title">{event.title}</h1>

              <div className="ticket-meta">
                <span className="badge">
                  {event.isPaid ? `₹ ${event.price}` : "FREE ENTRY"}
                </span>
              </div>

              <div className="ticket-content">
                <div className="ticket-qr">
                 <img 
  src={booking.qrCode} 
  alt="QR Code"
  style={{ width: "150px", height: "150px" }}
/>
                </div>

                <div className="ticket-details">
                  <p><strong>Name:</strong> {form.name}</p>
                  <p><strong>Email:</strong> {form.email}</p>
                  
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Date:</strong> {event.date || "2026"}</p>
                </div>
              </div>

              <div className="ticket-actions">
                <button onClick={downloadTicket} className="download-btn">
                  ⬇ Download Ticket
                </button>
                <button onClick={() => setShowModal(false)} className="close-btn">
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default EventDetails;