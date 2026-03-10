import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "./Banner.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {

  const [banners, setBanners] = useState([]); // safe default

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/promo-banner/list"
      );

      // ✅ FIX HERE
      setBanners(res.data.banners || []);

    } catch (error) {
      console.log(error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <div className="banner-slider">
      <Slider {...settings}>
        {banners.length > 0 ? (
          banners.map((item, index) => (
            <div key={index}>
              <img
                src={item.image}
                alt="banner"
                className="banner-image"
              />
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            No banners available
          </div>
        )}
      </Slider>
    </div>
  );
};

export default Banner;