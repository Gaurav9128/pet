import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import "./UpdateProduct.css";

const UpdateProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    rating: 4,
    bestseller: false,
    isAvailable: true,
    sizes: [],
    details: []
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/${id}`);
        if (res.data.success) {
          const p = res.data.product;
          setFormData({
            name: p.name,
            description: p.description,
            category: p.category,
            subCategory: p.subCategory,
            rating: p.rating || 4,
            bestseller: p.bestseller,
            isAvailable: p.isAvailable,
            sizes: p.sizes || [],
            details: p.details || []
          });
          setExistingImages(p.image || []);
        }
      } catch {
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSizeChange = (i, e) => {
    const sizes = [...formData.sizes];
    sizes[i][e.target.name] = e.target.value;
    setFormData({ ...formData, sizes });
  };

  const handleDetailChange = (i, e) => {
    const details = [...formData.details];
    details[i][e.target.name] = e.target.value;
    setFormData({ ...formData, details });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { label: "", mrp: "", price: "" }]
    });
  };

  const removeSize = (i) => {
    const sizes = [...formData.sizes];
    sizes.splice(i, 1);
    setFormData({ ...formData, sizes });
  };

  const addDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { label: "", value: "" }]
    });
  };

  const removeDetail = (i) => {
    const details = [...formData.details];
    details.splice(i, 1);
    setFormData({ ...formData, details });
  };

  const handleImageChange = (e) => {
    setNewImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeNewImage = (i) => {
    const imgs = [...newImages];
    imgs.splice(i, 1);
    setNewImages(imgs);
  };

  const removeExistingImage = (i) => {
    const imgs = [...existingImages];
    imgs.splice(i, 1);
    setExistingImages(imgs);
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const data = new FormData();

      data.append("id", id);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);
      data.append("rating", formData.rating);
      data.append("bestseller", formData.bestseller);
      data.append("isAvailable", formData.isAvailable);

      formData.sizes.forEach((s, i) =>
        data.append(`sizes[${i}]`, JSON.stringify(s))
      );

      data.append("details", JSON.stringify(formData.details));
      newImages.forEach((img) => data.append("images", img));
      data.append("existingImages", JSON.stringify(existingImages)); // send remaining existing images

      const res = await axios.post(
        `${backendUrl}/api/product/update`,
        data,
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        navigate("/list");
      }
    } catch {
      toast.error("Update failed");
    }
  };

  // ================= JSX =================
  return (
    <div className="update-page">
      <div className="update-container">
        <h2>Update Product</h2>

        <input
          className="input"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
        />

        <textarea
          className="input"
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="flex-row">
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Category</option>
            <option value="dogs">Dogs</option>
            <option value="cats">Cats</option>
          </select>

          <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
            <option value="">Sub Category</option>
            <option value="dry-food">Dry Food</option>
            <option value="wet-food">Wet Food</option>
          </select>

          <select name="rating" value={formData.rating} onChange={handleChange}>
            {[1,2,3,4,5].map(r => (
              <option key={r} value={r}>{r} ★</option>
            ))}
          </select>
        </div>

        {/* ================= EXISTING IMAGES ================= */}
        {existingImages.length > 0 && (
          <div>
            <h3 className="font-semibold">Existing Images</h3>
            <div className="flex gap-3 flex-wrap mb-3">
              {existingImages.map((img, i) => (
                <div key={i} className="relative image-box">
                  <img
                    src={img}
                    alt=""
                    className="w-24 h-24 object-cover border"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white px-1"
                    onClick={() => removeExistingImage(i)}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= NEW IMAGES ================= */}
        <h3 className="font-semibold">New Images</h3>
        <div className="flex gap-3 flex-wrap mb-3">
          {newImages.map((img, i) => (
            <div key={i} className="relative image-box">
              <img
                src={URL.createObjectURL(img)}
                alt=""
                className="w-24 h-24 object-cover border"
              />
              <button
                type="button"
                onClick={() => removeNewImage(i)}
                className="absolute top-0 right-0 bg-red-600 text-white px-1"
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        <input type="file" multiple onChange={handleImageChange} />

        {/* ================= SIZES ================= */}
        <h3>Sizes & Pricing</h3>
        {formData.sizes.map((s, i) => (
          <div className="repeat-row" key={i}>
            <input name="label" placeholder="Size" value={s.label} onChange={(e) => handleSizeChange(i, e)} />
            <input name="mrp" placeholder="MRP" value={s.mrp} onChange={(e) => handleSizeChange(i, e)} />
            <input name="price" placeholder="Price" value={s.price} onChange={(e) => handleSizeChange(i, e)} />
            <button className="remove-btn" type="button" onClick={() => removeSize(i)}>×</button>
          </div>
        ))}
        <button className="btn" type="button" onClick={addSize}>Add Size</button>

        {/* ================= DETAILS ================= */}
        <h3>Product Details</h3>
        {formData.details.map((d, i) => (
          <div className="repeat-row" key={i}>
            <input name="label" placeholder="Label" value={d.label} onChange={(e) => handleDetailChange(i, e)} />
            <input name="value" placeholder="Value" value={d.value} onChange={(e) => handleDetailChange(i, e)} />
            <button className="remove-btn" type="button" onClick={() => removeDetail(i)}>×</button>
          </div>
        ))}
        <button className="btn" type="button" onClick={addDetail}>Add Detail</button>

        {/* ================= CHECKBOX ================= */}
        <div className="checkbox-row">
          <input type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleChange} />
          <label>Bestseller</label>
        </div>

        <button className="save-btn" type="button" onClick={handleUpdate}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UpdateProduct;
