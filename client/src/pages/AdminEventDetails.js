import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf"; 
import autoTable from "jspdf-autotable"; // Import the function directly

function AdminEventDetails() {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [assignedVolunteers, setAssignedVolunteers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
    fetchRequests();
    fetchAssignedVolunteers();
  }, []);

  // 🔥 FIXED DOWNLOAD PDF FUNCTION
  const downloadPDF = () => {
    const doc = new jsPDF("landscape"); 

    doc.setFontSize(18);
    doc.text("Event Registration Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Event ID: ${id} | Generated: ${new Date().toLocaleString()}`, 14, 22);

    const tableColumn = ["Name", "Email", "Age", "College ID", "College", "Location", "Payment", "Checked In"];
    const tableRows = [];

    bookings.forEach((b) => {
      const rowData = [
        b.name || b.userId?.name || "N/A",
        b.email,
        b.age,
        b.collegeId || "-",
        b.collegeName || "-",
        b.location || "-",
        b.paymentStatus,
        b.isCheckedIn ? "Yes" : "No",
      ];
      tableRows.push(rowData);
    });

    // ✅ CALL autoTable directly instead of doc.autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [248, 68, 100] }, // Fest Pink Color
    });

    doc.save(`Registrations_${id}.pdf`);
  };

  // ... (rest of your fetch and handle functions)
  
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/event-bookings/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/events/volunteer-requests/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchAssignedVolunteers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/events/${id}`);
      setAssignedVolunteers(res.data.assignedVolunteers || []);
    } catch (err) { console.error(err); }
  };

const handleRequest = async (requestId, status) => {
  try {
    console.log("Clicked:", requestId, status); // 👈 ADD THIS

    await axios.put(
      `http://localhost:5000/api/events/handle-volunteer/${requestId}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Request Updated"); // 👈 ADD THIS

    fetchRequests();
    fetchAssignedVolunteers();

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
  }
};

  const deleteBooking = async (bookingId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this registration?")) return;
      await axios.delete(`http://localhost:5000/api/bookings/delete/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8">Event Management</h1>

      {/* Volunteer Requests */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Volunteer Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          requests.map((r) => (
            <div key={r._id} className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-semibold">{r.volunteerId?.name}</p>
                <p className="text-sm text-gray-500">{r.volunteerId?.email}</p>
              </div>
              <div className="space-x-3">
                <button onClick={() => handleRequest(r._id, "approved")} className="bg-green-500 text-white px-4 py-1 rounded-lg">Approve</button>
                <button onClick={() => handleRequest(r._id, "rejected")} className="bg-red-500 text-white px-4 py-1 rounded-lg">Reject</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assigned Volunteers */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Assigned Volunteers</h2>
        {assignedVolunteers.length === 0 ? (
          <p className="text-gray-500">No volunteers assigned yet.</p>
        ) : (
          assignedVolunteers.map((v) => (
            <div key={v._id} className="border-b py-2">
              <p className="font-semibold">{v.name}</p>
              <p className="text-sm text-gray-500">{v.email}</p>
            </div>
          ))
        )}
      </div>

      {/* Registrations Table */}
      <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Event Registrations</h2>
          <button 
            onClick={downloadPDF}
            className="bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-lg font-semibold transition flex items-center gap-2"
          >
            📥 Download PDF Report
          </button>
        </div>

       <table className="w-full text-left border-collapse bg-white rounded-xl overflow-hidden shadow-lg">

  <thead className="bg-gray-100">
    <tr>
      <th className="p-3">Name</th>
      <th className="p-3">Email</th>
      <th className="p-3">Age</th>
      <th classname="p-3">Quantity</th>
      <th className="p-3">College ID</th>
      <th className="p-3">College</th>
      <th className="p-3">Location</th>
      <th className="p-3">Custom Fields</th>
      <th className="p-3">Payment</th>
      <th className="p-3">Checked In</th>
      <th className="p-3">Action</th>
    </tr>
  </thead>
<tbody>
  {bookings.map((b) => (
    <tr key={b._id} className="border-b hover:bg-gray-50">

      {/* Default Fields */}
      <td className="p-3 font-semibold">
        {b.name || "-"}
      </td>

      <td className="p-3">
        {b.email || "-"}
      </td>

      <td className="p-3">
        {b.age || "-"}
      </td>
       <td className="p-3">
        {b.quantity || "-"}
      </td>
      <td className="p-3">
        {b.collegeId || "-"}
      </td>
      <td className="p-3">
        {b.collegeName || "-"}  
      </td>
      <td className="p-3">
        {b.location || "-"}
      </td>

      {/* 🔥 CUSTOM FIELDS */}
      <td className="p-3 text-sm">
        {b.customResponses && b.customResponses.length > 0 ? (
          b.customResponses.map((field, index) => (
            <div key={index}>
              <strong>{field.label}:</strong> {field.value}
            </div>
          ))
        ) : (
          "-"
        )}
      </td>

      {/* Payment */}
      <td className="p-3 text-green-600 font-bold">
        {b.paymentStatus}
      </td>

      {/* Checked In */}
      <td className="p-3">
        {b.isCheckedIn ? "✅ Yes" : "❌ No"}
      </td>

      {/* Delete */}
      <td className="p-3">
        <button
          onClick={() => deleteBooking(b._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
        >
          Delete
        </button>
      </td>

    </tr>
  ))}
</tbody>

</table>
        {bookings.length === 0 && <p className="text-gray-500 mt-4">No registrations yet.</p>}
      </div>
    </div>
  );
}

export default AdminEventDetails;