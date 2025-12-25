import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1 className="contact-title">Contact Us</h1>

        <div className="contact-info">
          <p>
            <span>Developer Name:</span> Rizwaan Bhati
          </p>
          <p>
            <span>Email:</span> Rizwaanbhati.rb1004@gmail.com
          </p>
          <p>
            <span>Contact Number:</span> 7014021793
          </p>
        </div>

        <div className="contact-footer">
          <p>Taken By Developer</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
