// Header.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import { logoutUser } from '../../services/auth.service';

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
      setMenuOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <h1>Cake Customizer</h1>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="mobile-menu-toggle" onClick={toggleMenu}>
            &#9776;
          </div>

          {/* Navigation */}
          <nav className={`nav-menu ${menuOpen ? 'show' : ''}`}>
            <ul>
              <li><Link className="nav-link" to="/" onClick={closeMenu}>Design a Cake</Link></li>
              <li><Link className="nav-link" to="/gallery" onClick={closeMenu}>Cake Gallery</Link></li>
              <li><Link className="nav-link" to="/about" onClick={closeMenu}>About Us</Link></li>
            </ul>
          </nav>

          {/* User Actions */}
          <div className="user-actions">
            {/* Cart Icon */}
            <Link to="/cart" className="cart-link" onClick={closeMenu}>
              <span className="material-icons">shopping_cart</span>
              <span className="cart-items-count" id="cart-count"></span>
            </Link>

            {/* If logged in */}
            {currentUser ? (
              <div className="user-dropdown">
                <span className="user-name">
                  {currentUser.displayName || 'Account'}
                </span>
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={closeMenu}>Profile</Link>
                  <Link to="/orders" onClick={closeMenu}>Orders</Link>
                  <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline" onClick={closeMenu}>Login</Link>
                <Link to="/register" className="btn-primary" onClick={closeMenu}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && <div className="overlay" onClick={closeMenu}></div>}

      {/* Add this to main CSS or your style file */}
      <style>{`
        .user-dropdown {
          position: relative;
          display: inline-block;
          margin-left: 1rem;
        }

        .user-name {
          cursor: pointer;
          font-weight: bold;
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          background-color: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 10px;
          top: 100%;
          right: 0;
          z-index: 100;
          min-width: 140px;
          border-radius: 8px;
        }

        .user-dropdown:hover .dropdown-menu {
          display: block;
        }

        .dropdown-menu a, .dropdown-menu button {
          display: block;
          padding: 8px 12px;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
          color: #333;
          width: 100%;
        }

        .dropdown-menu a:hover,
        .dropdown-menu button:hover {
          background-color: #f0f0f0;
        }

        .btn-logout {
          color: red;
          font-weight: bold;
        }
      `}</style>
    </header>
  );
};

export default Header;
