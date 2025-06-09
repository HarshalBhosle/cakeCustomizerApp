// src/components/Layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-column">
            <h3>Cake Customizer</h3>
            <p>
              Create delicious custom cakes for any occasion. Choose your flavors, toppings, and size for the perfect cake experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link className="footer-link" to="/">Design a Cake</Link></li>
              <li><Link className="footer-link" to="/gallery">Cake Gallery</Link></li>
              <li><Link className="footer-link" to="/about">About Us</Link></li>
              <li><Link className="footer-link" to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-column">
            <h3>Customer Service</h3>
            <ul className="footer-links">
              <li><Link className="footer-link" to="/faq">FAQ</Link></li>
              <li><Link className="footer-link" to="/delivery">Delivery Information</Link></li>
              <li><Link className="footer-link" to="/returns">Returns & Refunds</Link></li>
              <li><Link className="footer-link" to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p>Email: <a href="mailto:harsalb1202@gmail.com">harsalb1202@gmail.com</a></p>
            <p>Phone: <a href="tel:8956558029">+91-8956558029</a></p>
            <p>k 003 hari om park ambarnath east</p>
            <div className="social-icons">
              <a className="social-icon" href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a className="social-icon" href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a className="social-icon" href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a className="social-icon" href="#" aria-label="Pinterest"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Cake Customizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
