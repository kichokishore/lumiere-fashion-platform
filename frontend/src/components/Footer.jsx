import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h3>LUMIÈRE</h3>
          <p>Elevating everyday fashion.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <a href="#">New Arrivals</a>
            <a href="#">Best Sellers</a>
            <a href="#">Sale</a>
          </div>
          <div>
            <h4>Help</h4>
            <a href="#">FAQ</a>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Lumière Fashion. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
