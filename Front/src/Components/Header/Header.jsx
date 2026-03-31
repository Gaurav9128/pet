import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "./Header.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Header = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/banners`
      );

      if (Array.isArray(res.data)) {
        setBanners(res.data);
      } else {
        setBanners([]);
      }
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
    arrows: true, // Desktop par dikhenge
    autoplay: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false, // Mobile par arrows hata diye taaki image badi dikhe
        }
      }
    ]
  };

  return (
    <div className="homeBannerSection">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div className="item" key={banner._id}>
            <img
              src={banner.imageUrl}
              className="banner-img"
              alt="banner"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Header;