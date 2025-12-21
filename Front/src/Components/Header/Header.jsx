import React from 'react';
import Slider from "react-slick";
import "./Header.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Header = () => {

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true
  };

  return (
    <>
      {/* Banner Slider Section */}
      <div className="homeBannerSection">
        <Slider {...settings}>
          
          <div className="item">
            <img 
              src="https://supertails.com/cdn/shop/files/all_page_web_cc139d33-ac45-4c4c-9f93-dc3e377a4ab2_1200x.webp?v=1761559760" 
              className="w-100" 
              alt=""
            />
          </div>

          <div className="item">
            <img 
              src="https://supertails.com/cdn/shop/files/grooming_02e823af-cb4c-4102-8234-1ab76478e5eb_1200x.webp?v=1762425319" 
              className="w-100" 
              alt=""
            />
          </div>

          <div className="item">
            <img 
              src="https://supertails.com/cdn/shop/files/digestive_1200x.webp?v=1762425293" 
              className="w-100" 
              alt=""
            />
          </div>

          <div className="item">
            <img 
              src="https://supertails.com/cdn/shop/files/rc_9032e7dc-a2c7-4d05-8420-6fc402e02254_1200x.webp?v=1762425189" 
              className="w-100" 
              alt=""
            />
          </div>

          <div className="item">
            <img 
              src="https://supertails.com/cdn/shop/files/scented_1200x.webp?v=1762425672" 
              className="w-100" 
              alt=""
            />
          </div>

        </Slider>
        <br/>
        <br/>
      </div>
    </>
  );
};

export default Header;
