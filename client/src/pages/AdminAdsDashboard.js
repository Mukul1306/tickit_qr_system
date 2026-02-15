import { useEffect, useState } from "react";
import axios from "axios";
import "./CreateAd.css";

function AdminAdsDashboard() {
  const [ads, setAds] = useState([]);
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchMyAds();
  }, []);

  const fetchMyAds = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/ads/my-ads",
        config
      );
      setAds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAd = async (id) => {
    if (!window.confirm("Delete this ad?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/ads/delete/${id}`,
        config
      );
      fetchMyAds();
    } catch (err) {
      console.error(err);
    }
  };

  const calculateCTR = (ad) => {
    if (!ad.impressions || ad.impressions === 0) return 0;
    return ((ad.clicks / ad.impressions) * 100).toFixed(2);
  };

  return (
    <div className="admin-ads-container">
      <h1 className="ads-heading">📊 My Advertisements</h1>

      {ads.length === 0 ? (
        <p className="no-ads">No ads created yet.</p>
      ) : (
        <div className="ads-grid">
          {ads.map((ad) => (
            <div key={ad._id} className="ad-analytics-card">

              <img src={ad.imageUrl} alt={ad.title} />

              <div className="ad-info">
                <h3>{ad.title}</h3>

                <span className={`status ${ad.status}`}>
                  {ad.status.toUpperCase()}
                </span>

                <div className="ad-stats">
                  <div>
                    <p>Impressions</p>
                    <strong>{ad.impressions || 0}</strong>
                  </div>

                  <div>
                    <p>Clicks</p>
                    <strong>{ad.clicks || 0}</strong>
                  </div>

                  <div>
                    <p>CTR</p>
                    <strong>{calculateCTR(ad)}%</strong>
                  </div>

                  <div>
                    <p>Revenue</p>
                    <strong>₹{ad.revenue || 0}</strong>
                  </div>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteAd(ad._id)}
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminAdsDashboard;