import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminCoupons.css";

const AdminCoupons = ({ backendUrl, adminToken }) => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "flat",
    discountValue: "",
    minCartValue: "",
  });

  // LOAD COUPONS
  const loadCoupons = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/coupon/all`,
        { headers: { token: adminToken } }
      );
      if (data.success) setCoupons(data.coupons);
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE COUPON
  const createCoupon = async () => {
    if (!form.code || !form.discountValue) return alert("Fill all fields");

    try {
      await axios.post(
        `${backendUrl}/api/admin/coupon/create`,
        form,
        { headers: { token: adminToken } }
      );

      setForm({
        code: "",
        discountType: "flat",
        discountValue: "",
        minCartValue: "",
      });

      loadCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  // ENABLE / DISABLE
  const toggleCoupon = async (id) => {
    try {
      await axios.put(
        `${backendUrl}/api/admin/coupon/toggle/${id}`,
        {},
        { headers: { token: adminToken } }
      );
      loadCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE
  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;

    try {
      await axios.delete(
        `${backendUrl}/api/admin/coupon/delete/${id}`,
        { headers: { token: adminToken } }
      );
      loadCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  return (
    <div className="coupon-container">
      <h2 className="page-title">Coupon Panel</h2>

      {/* CREATE FORM */}
      <div className="coupon-form">
        <input
          placeholder="Coupon Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />

        <input
          type="number"
          placeholder="Discount Value"
          value={form.discountValue}
          onChange={(e) =>
            setForm({ ...form, discountValue: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Min Cart Value"
          value={form.minCartValue}
          onChange={(e) =>
            setForm({ ...form, minCartValue: e.target.value })
          }
        />

        <button className="btn-primary" onClick={createCoupon}>
          Create Coupon
        </button>
      </div>

      {/* LIST */}
      <div className="coupon-list">
        <div className="coupon-header">
          <span>Code</span>
          <span>Discount</span>
          <span>Min Cart</span>
          <span>Actions</span>
        </div>

        {coupons.map((c) => (
          <div className="coupon-row" key={c._id}>
            <span className="code">{c.code}</span>
            <span>₹{c.discountValue}</span>
            <span>₹{c.minCartValue || 0}</span>

            <div className="actions">
              <button
                className={c.isActive ? "btn-disable" : "btn-enable"}
                onClick={() => toggleCoupon(c._id)}
              >
                {c.isActive ? "Disable" : "Enable"}
              </button>

              <button
                className="btn-delete"
                onClick={() => deleteCoupon(c._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCoupons;
