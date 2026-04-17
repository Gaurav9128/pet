import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./CouponDeals.css";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const CouponDeals = () => {

  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 9;

  const { backendUrl } = useContext(StoreContext);

  const gradients = [
    "linear-gradient(135deg, #b3e5fc, #81d4fa)",
    "linear-gradient(135deg, #ffe0b2, #ffcc80)",
    "linear-gradient(135deg, #e1bee7, #ce93d8)",
    "linear-gradient(135deg, #f8bbd0, #f48fb1)"
  ];

  useEffect(() => {
    const fetchCoupons = async () => {
      try {

        const res = await axios.get(`${backendUrl}/api/coupons`);

        if (res.data.success) {

          // newest coupon first
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

    setTimeout(() => {
      setCopiedCode(null);
    }, 1500);

  };



  // pagination logic

  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;

  const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);

  const totalPages = Math.ceil(coupons.length / couponsPerPage);



  const handlePageChange = (page) => {

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };



  return (
    <div className="coupon-section">

      <h2 className="coupon-title">Tail-Wagging Deals 🐾</h2>


      <div className="coupon-grid">

        {currentCoupons.map((coupon, index) => {

          const isPercentage = coupon.discountType === "percentage";
          const isCopied = copiedCode === coupon.code;

          return (

            <div
              className="coupon-card"
              key={coupon._id}
              style={{ background: gradients[index % gradients.length] }}
            >

              <div className="dashed-border">

                <div className="coupon-content">


                  <div className="coupon-top">

                    <div className="paw-circle">🐾</div>

                    <div>

                      <h3>
                        Extra{" "}
                        {isPercentage
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}{" "}
                        OFF
                      </h3>

                      <p>on orders over ₹{coupon.minCartValue}</p>

                    </div>

                  </div>



                  <div className="coupon-strip">

                    <span className="coupon-code">
                      {coupon.code}
                    </span>

                    <button
                      className={`copy-btn ${isCopied ? "copied" : ""}`}
                      onClick={() => handleCopy(coupon.code)}
                    >

                      {isCopied ? "✓ Copied" : "Copy"}

                    </button>

                  </div>


                </div>

              </div>

            </div>

          );

        })}

      </div>


      {/* AMAZON STYLE PAGINATION */}

      {totalPages > 1 && (

        <div className="pagination">

          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ◀ Prev
          </button>


          {[...Array(totalPages)].map((_, index) => {

            const page = index + 1;

            return (

              <button
                key={page}
                className={currentPage === page ? "active-page" : ""}
                onClick={() => handlePageChange(page)}
              >

                {page}

              </button>

            );

          })}


          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next ▶
          </button>

        </div>

      )}

    </div>
  );

};

export default CouponDeals;