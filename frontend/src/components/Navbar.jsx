import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar glass-panel">
      <div className="container nav-content">
        <Link to="/" className="brand-logo">LUMIÈRE</Link>
        <nav className="nav-links">
          <Link to="/">New Arrivals</Link>
          <Link to="/">Collections</Link>
          <Link to="/admin" className="admin-link">Admin</Link>
        </nav>
        <div className="nav-actions">
          <button className="btn btn-accent btn-sm">Cart (0)</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
