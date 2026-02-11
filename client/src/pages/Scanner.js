import { useEffect, useState } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

function Scanner() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [scannedData, setScannedData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVolunteerEvents();
  }, []);

  const fetchVolunteerEvents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/events/volunteer-events",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      false
    );

    scanner.render(async (decodedText) => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/verify/${decodedText}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setScannedData(res.data);
        scanner.clear();
      } catch (error) {
        alert("Invalid Ticket ❌");
      }
    });
  };

  const markEntry = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/checkin/${scannedData.bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("✅ Entry Marked Successfully");
      setScannedData(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex items-center justify-center p-6">

      <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-2xl">

        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
          🎟 Volunteer Scanner
        </h1>

        <select
          className="w-full p-4 rounded-xl border border-gray-300 mb-6"
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">Select Event</option>
          {events.map(e => (
            <option key={e._id} value={e._id}>
              {e.title}
            </option>
          ))}
        </select>

        {selectedEvent && (
          <button
            onClick={startScanner}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-lg"
          >
            🚀 Start Scanner
          </button>
        )}

        <div id="reader" className="mt-8 rounded-xl overflow-hidden"></div>

{scannedData && (
  <div className="bg-white mt-8 p-6 rounded-2xl shadow-xl border border-gray-200">

    <h3 className="text-2xl font-bold text-indigo-600 mb-4">
      🎟 Ticket Details
    </h3>

    <div className="space-y-2 text-gray-700">

      <p><strong>Name:</strong> {scannedData.name || scannedData.userId?.name || "N/A"}</p>

      <p><strong>Email:</strong> {scannedData.email}</p>

      <p><strong>Age:</strong> {scannedData.age}</p>

      <p><strong>Booking ID:</strong> {scannedData.bookingId}</p>

      <p>
        <strong>Status:</strong>{" "}
        {scannedData.isCheckedIn
          ? "✅ Already Checked In"
          : "❌ Not Checked In"}
      </p>
         {/* 🔥 Custom Fields */}
{scannedData.customResponses && scannedData.customResponses.length > 0 && (
  <div className="mt-4 border-t pt-3">
    <h3 className="font-semibold text-lg mb-2 text-blue-600">
      Custom Details
    </h3>

    {scannedData.customResponses.map((field, index) => (
      <p key={index}>
        <strong>{field.label}:</strong> {field.value || "-"}
      </p>
    ))}
  </div>
)}
    </div>

    {!scannedData.isCheckedIn && (
      <button
        onClick={markEntry}
        className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
      >
        ✅ Mark Entry
      </button>
    )}

  </div>
)}

      </div>
    </div>
  );
}

export default Scanner;
