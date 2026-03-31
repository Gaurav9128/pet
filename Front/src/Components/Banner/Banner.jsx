import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "./Banner.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Banner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    if (backendUrl) {
      fetchBanner();
    }
  }, [backendUrl]);

  const fetchBanner = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/promo-banner/list`);
      setBanners(res.data.banners || []);
    } catch (error) {
      console.log("Error fetching banners:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Mobile par arrows aksar distrub karte hain
  };

  return (
    <div className="banner-slider">
      <Slider {...settings}>
        {banners.length > 0 ? (
          banners.map((item, index) => (
            <div key={index} className="banner-slide-item">
              <img
                src={item.image}
                alt={`banner-${index}`}
                className="banner-img"
              />
            </div>
          ))
        ) : (
          <div className="no-banner">No banners available</div>
        )}
      </Slider>
    </div>
  );
};

export default Banner;