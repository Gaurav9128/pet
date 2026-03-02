import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminBanner.css";

const AdminBanner = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [image, setImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (backendUrl) {
      fetchBanners();
    }
  }, [backendUrl]);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/banners`);
      setBanners(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("Fetch Error:", error);
      setBanners([]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image first");
      return;
    }

    // 🔹 Check image dimensions before upload
    const img = new Image();
    const objectUrl = URL.createObjectURL(image);
    img.src = objectUrl;

    img.onload = async () => {

      // ✅ Exact size validation (1800 x 520)
      if (img.width !== 1800 || img.height !== 520) {
        alert("Please upload image of size 1800 × 520 pixels only.");
        URL.revokeObjectURL(objectUrl);
        return;
      }

      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("image", image);

        await axios.post(
          `${backendUrl}/api/banners/upload`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        alert("Banner uploaded successfully!");
        setImage(null);
        fetchBanners();

      } catch (error) {
        console.log("Upload Error:", error);
        alert("Upload failed");
      } finally {
        setLoading(false);
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      alert("Invalid image file.");
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${backendUrl}/api/banners/${id}`);
      alert("Banner deleted successfully!");
      fetchBanners();
    } catch (error) {
      console.log("Delete Error:", error);
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-banner-container">

      <h2 className="page-title">Banner Management</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="upload-btn"
        >
          {loading ? "Uploading..." : "Upload Banner"}
        </button>
      </form>

      <div className="banner-grid">
        {banners.length === 0 ? (
          <p>No banners found</p>
        ) : (
          banners.map((banner) => (
            <div key={banner._id} className="banner-card">

              <img
                src={banner.imageUrl}
                alt="banner"
                className="banner-image"
              />

              <p className="status">
                Status: {banner.isActive ? "Active" : "Inactive"}
              </p>

              <button
                onClick={() => handleDelete(banner._id)}
                className="delete-btn"
              >
                Delete
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AdminBanner;