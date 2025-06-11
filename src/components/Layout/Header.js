// Header.js
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import { logoutUser } from '../../services/auth.service';

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navMenuRef.current &&
        !navMenuRef.current.contains(event.target) &&
        mobileToggleRef.current &&
        !mobileToggleRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Mobile Menu Toggle (Hamburger Icon) */}
          <div
            className={`mobile-menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            ref={mobileToggleRef}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>

          {/* Logo and Site Title */}
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
            <img src="/Favicon.png" alt="Cake Customizer Logo" className="site-logo bounce-logo" />
              <h1>JyoCustomize</h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav
            className={`nav-menu ${menuOpen ? 'show' : ''}`}
            ref={navMenuRef}
            id="main-navigation"
          >
            <ul>
              {currentUser && (
                <li>
                  <NavLink
                    className="nav-link"
                    to="/dashboard"
                    onClick={closeMenu}
                    activeClassName="active"
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  className="nav-link"
                  to="/"
                  onClick={closeMenu}
                  activeClassName="active"
                  end
                >
                  Generate Cake Image
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/gallery"
                  onClick={closeMenu}
                  activeClassName="active"
                >
                  Cake Gallery
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/about"
                  onClick={closeMenu}
                  activeClassName="active"
                >
                  About Us
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* User Actions */}
          <div className="user-actions">
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

      {/* Inline styles for demonstration. Consider moving to a dedicated CSS file. */}
      <style>{`
        .header {
          background-color: #2c3e50; /* Changed to a dark blue-grey */
          padding: 1rem 0;
          border-bottom: 1px solid #444; /* Slightly darker border */
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* Adjusted shadow for darker background */
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo a {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Styling for the logo image */
        .site-logo {
          max-height: 40px;
          width: auto;
          display: block;
        }

        .logo h1 {
          font-size: 1.8rem;
          color: #f8f8f8; /* Changed text color to off-white for contrast */
          margin: 0;
          white-space: nowrap;
        }

        .nav-menu ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 1.5rem;
        }

        .nav-link {
          text-decoration: none;
          color: #f0f0f0; /* Changed text color to light grey for contrast */
          font-weight: 500;
          transition: color 0.3s ease;
          padding: 0.5rem 0;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #ff6f61; /* This accent color should still stand out */
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-outline, .btn-primary {
          padding: 0.6rem 1rem;
          border-radius: 5px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .btn-outline {
          border: 1px solid #ff6f61;
          color: #ff6f61; /* Keep original color, it stands out */
          background-color: transparent;
        }

        .btn-outline:hover {
          background-color: #ff6f61;
          color: white;
        }

        .btn-primary {
          background-color: #ff6f61;
          color: white;
          border: 1px solid #ff6f61;
        }

        .btn-primary:hover {
          background-color: #e65c50;
          border-color: #e65c50;
        }

        /* User Dropdown Styles */
        .user-dropdown {
          position: relative;
          display: inline-block;
          margin-left: 1rem;
        }

        .user-name {
          cursor: pointer;
          font-weight: bold;
          color: #f0f0f0; /* Changed text color to light grey for contrast */
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          background-color: #3e5060; /* Darker background for dropdown */
          box-shadow: 0 2px 8px rgba(0,0,0,0.3); /* Adjusted shadow for darker background */
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
          color: #f0f0f0; /* Changed text color to light grey for contrast */
          width: 100%;
          border-radius: 5px;
        }

        .dropdown-menu a:hover,
        .dropdown-menu button:hover {
          background-color: #4a5d70; /* Lighter hover background for dropdown */
        }

        .btn-logout {
          color: #ff6f61; /* Accent color for logout, stands out */
          font-weight: bold;
        }

        /* Mobile Menu Specific Styles */
        .mobile-menu-toggle {
          display: none;
          cursor: pointer;
          flex-direction: column;
          gap: 4px;
          padding: 5px;
          position: relative;
          z-index: 110;
        }

        .hamburger-line {
          width: 25px;
          height: 3px;
          background-color: #f0f0f0; /* Changed hamburger lines to light grey/white */
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        /* Hamburger animation */
        .mobile-menu-toggle.open .hamburger-line:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .mobile-menu-toggle.open .hamburger-line:nth-child(2) {
          opacity: 0;
        }
        .mobile-menu-toggle.open .hamburger-line:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .nav-menu {
          transition: all 0.3s ease-in-out;
          pointer-events: auto;
        }

        .overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 90;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .nav-menu {
            position: fixed;
            top: 0;
            left: -250px;
            width: 220px;
            height: 100%;
            background-color: #3e5060; /* Darker background for mobile menu itself */
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            padding-top: 60px;
            flex-direction: column;
            z-index: 100;
          }

          .nav-menu.show {
            left: 0;
          }

          .nav-menu ul {
            flex-direction: column;
            gap: 0.5rem;
          }

          .nav-menu li {
            width: 100%;
          }

          .nav-menu .nav-link {
            padding: 10px 15px;
            display: block;
            border-bottom: 1px solid #556a7c; /* Lighter border for contrast */
            color: #f0f0f0; /* Ensure mobile links are visible */
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .header-content {
            justify-content: space-between;
          }

          .user-actions {
            margin-left: auto;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .overlay {
            display: block;
          }

          .nav-menu:not(.show) {
            pointer-events: none;
          }

          .logo {
            order: 2;
            margin-left: auto;
            margin-right: auto;
          }

          .logo a {
            flex-direction: row;
            gap: 5px;
          }
          .site-logo {
            max-height: 35px;
          }
          .logo h1 {
            font-size: 1.5rem;
            color: #f8f8f8; /* Ensure mobile title is visible */
          }

          .user-actions {
            order: 3;
          }

          @media (max-width: 480px) {
            .user-actions {
              flex-direction: column;
              align-items: stretch;
              gap: 0.8rem;
            }

            .user-actions .btn-outline,
            .user-actions .btn-primary {
              width: 100%;
              text-align: center;
              margin: 0;
            }
          }
        }
      `}</style>
    </header>
  );
};

export default Header;