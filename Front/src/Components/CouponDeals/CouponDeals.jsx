import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./CouponDeals.css";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const CouponDeals = () => {
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 8; // Image mein 8 cards (4x2) dikh rahe hain

  const { backendUrl } = useContext(StoreContext);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/coupons`);
        if (res.data.success) {
          const sortedCoupons = [...res.data.coupons].reverse();
          setCoupons(sortedCoupons);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoupons();
  }, [backendUrl]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Coupon copied 🎉");
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPages = Math.ceil(coupons.length / couponsPerPage);

  return (
    <div className="coupon-container">
      <h2 className="coupon-title text-center">Tail-Wagging Deals 🐾</h2>
      <div className="coupon-grid">
        {currentCoupons.map((coupon) => (
          <div className="coupon-card" key={coupon._id}>
            <h3 className="discount-text">
              Extra {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} OFF
            </h3>
            <div className="coupon-row">
              <div className="code-box">
                {coupon.code}
              </div>
              <button 
                className="copy-button" 
                onClick={() => handleCopy(coupon.code)}
              >
                {copiedCode === coupon.code ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Style as per Image */}
      {totalPages > 1 && (
        <div className="custom-pagination">
          <button 
            className="arrow-btn" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            ‹
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i + 1} 
              className={`page-num ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button 
            className="next-btn" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponDeals;