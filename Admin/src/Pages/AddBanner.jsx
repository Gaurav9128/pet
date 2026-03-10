import React, { useEffect, useState } from "react";
import axios from "axios";

const AddBanner = () => {
  const [image, setImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/promo-banner/list");

      if (res.data?.success && Array.isArray(res.data.banners)) {
        setBanners(res.data.banners);
      } else if (Array.isArray(res.data)) {
        setBanners(res.data);
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.log(err);
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:4000/api/promo-banner/add",
        formData
      );

      if (res.data?.success) {
        alert("Banner Uploaded ✅");
        setImage(null);
        fetchBanners();
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.log(err);
      alert("Upload Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    const ok = window.confirm("Delete this banner?");
    if (!ok) return;

    try {
      const res = await axios.delete(
        `http://localhost:4000/api/promo-banner/delete/${id}`
      );

      if (res.data?.success) {
        alert("Banner Deleted 🗑️");
        fetchBanners();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      {/* TITLE */}
      <h1 className="text-xl sm:text-2xl font-semibold mb-6">
        Banner Management
      </h1>

      {/* UPLOAD BAR */}
      <form
        onSubmit={submitHandler}
        className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm w-full sm:w-fit"
      >
        {/* File Picker */}
        <label className="border rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50 text-center">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          Choose File
        </label>

        {/* File Name */}
        <span className="text-gray-500 text-sm break-words sm:w-48">
          {image ? image.name : "No file chosen"}
        </span>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition w-full sm:w-auto"
        >
          {loading ? "Uploading..." : "Upload Banner"}
        </button>
      </form>

      {/* BANNERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {banners.length === 0 && (
          <p className="text-gray-500">No banners uploaded</p>
        )}

        {banners.map((banner) => (
          <div
            key={banner._id}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
            <img
              src={banner.image}
              alt="banner"
              className="rounded-lg mb-4 w-full h-36 sm:h-40 md:h-44 object-cover"
            />

            <p className="text-sm mb-3">
              Status:{" "}
              <span className="font-medium text-green-600">Active</span>
            </p>

            <button
              onClick={() => deleteBanner(banner._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm w-full"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddBanner;