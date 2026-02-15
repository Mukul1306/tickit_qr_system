import { useEffect, useState } from "react";
import axios from "axios";

function AdsPage() {
  const [ads, setAds] = useState([]);
  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchAds = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/ads/all",
        config
      );
      setAds(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const approveAd = async (id) => {
    await axios.put(
      `http://localhost:5000/api/ads/approve/${id}`,
      {},
      config
    );
    fetchAds();
  };

  const rejectAd = async (id) => {
    await axios.put(
      `http://localhost:5000/api/ads/reject/${id}`,
      {},
      config
    );
    fetchAds();
  };

  const deleteAd = async (id) => {
    if (!window.confirm("Delete this ad?")) return;

    await axios.delete(
      `http://localhost:5000/api/ads/delete/${id}`,
      config
    );
    fetchAds();
  };

  return (
    <div style={container}>
      <h2 style={heading}>📢 Manage Advertisements</h2>

      {ads.length === 0 && (
        <p style={{ color: "#888" }}>No ads found.</p>
      )}

      {ads.map((ad) => (
        <div key={ad._id} style={card}>

          <img
            src={ad.imageUrl}
            alt={ad.title}
            style={image}
          />

          <div style={{ flex: 1 }}>

            <h3 style={{ marginBottom: "8px" }}>
              {ad.title}
            </h3>

            <p style={{ color: "#555" }}>
              {ad.description}
            </p>
<div style={statsBox}>
  <span>👁 {ad.impressions || 0}</span>
  <span>🖱 {ad.clicks || 0}</span>
  <span>💰 ₹ {ad.revenue || 0}</span>
</div>

            <p>
              <strong>Status:</strong>{" "}
              <span style={{
                padding: "5px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                background:
                  ad.status === "approved"
                    ? "#d4f8d4"
                    : ad.status === "rejected"
                    ? "#ffd6d6"
                    : "#fff3cd",
                color:
                  ad.status === "approved"
                    ? "green"
                    : ad.status === "rejected"
                    ? "red"
                    : "#b8860b"
              }}>
                {ad.status.toUpperCase()}
              </span>
            </p>

            {ad.status === "pending" && (
              <div style={{ marginTop: "15px" }}>
                <button
                  onClick={() => approveAd(ad._id)}
                  style={approveBtn}
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectAd(ad._id)}
                  style={rejectBtn}
                >
                  Reject
                </button>
              </div>
            )}

            <button
              onClick={() => deleteAd(ad._id)}
              style={deleteBtn}
            >
              Delete
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}

export default AdsPage;


/* ================== STYLES ================== */

const container = {
  padding: "40px",
  background: "#f9fafb",
  minHeight: "100vh"
};

const heading = {
  marginBottom: "30px",
  fontSize: "26px"
};

const card = {
  display: "flex",
  gap: "20px",
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  marginBottom: "25px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
};

const image = {
  width: "260px",
  height: "150px",
  objectFit: "cover",
  borderRadius: "12px"
};

const statsBox = {
  display: "flex",
  gap: "20px",
  marginTop: "12px",
  marginBottom: "12px",
  fontWeight: "500"
};

const approveBtn = {
  background: "#16a34a",
  color: "#fff",
  padding: "8px 16px",
  border: "none",
  borderRadius: "8px",
  marginRight: "10px",
  cursor: "pointer"
};

const rejectBtn = {
  background: "#dc2626",
  color: "#fff",
  padding: "8px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const deleteBtn = {
  background: "#111827",
  color: "#fff",
  padding: "6px 14px",
  border: "none",
  borderRadius: "8px",
  marginTop: "15px",
  cursor: "pointer"
};