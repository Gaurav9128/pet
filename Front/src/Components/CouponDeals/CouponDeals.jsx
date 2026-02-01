import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CouponDeals.css";

const CouponDeals = () => {
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  // 🎨 Multiple gradients
  const gradients = [
    "linear-gradient(135deg, #ff9a9e, #fad0c4)", // pink
    "linear-gradient(135deg, #a18cd1, #fbc2eb)", // purple
    "linear-gradient(135deg, #fbc2eb, #a6c1ee)", // blue
    "linear-gradient(135deg, #84fab0, #8fd3f4)", // green-blue
    "linear-gradient(135deg, #ffecd2, #fcb69f)", // orange
    "linear-gradient(135deg, #cfd9df, #e2ebf0)", // gray
  ];

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/coupons");
        if (res.data.success) {
          setCoupons(res.data.coupons);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoupons();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);

    setTimeout(() => {
      setCopiedCode(null);
    }, 1500);
  };

  return (
    <div className="coupon-section">
      <h2 className="coupon-title">Tail-Wagging Deals 🐶 🐾</h2>

      {coupons.length === 0 ? (
        <p>No coupons available</p>
      ) : (
        <div className="coupon-grid">
          {coupons.map((coupon, index) => {
            const isPercentage = coupon.discountType === "percentage";
            const isCopied = copiedCode === coupon.code;

            return (
              <div
                className="coupon-card"
                key={coupon._id}
                style={{
                  background: gradients[index % gradients.length],
                }}
              >
                <div className="coupon-top">
                  <h3>
                    Extra{" "}
                    {isPercentage
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}{" "}
                    OFF
                  </h3>
                  <p>on orders above ₹{coupon.minCartValue}</p>
                </div>

                <div className="coupon-bottom">
                  <span className="coupon-code">{coupon.code}</span>

                  <button
                    className={isCopied ? "copied-btn" : ""}
                    onClick={() => handleCopy(coupon.code)}
                  >
                    {isCopied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CouponDeals;
