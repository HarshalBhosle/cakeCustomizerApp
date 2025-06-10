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

          {/* Logo */}
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <h1>Cake Customizer</h1>
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
          background-color: #f8f8f8;
          padding: 1rem 0;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
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

        .logo h1 {
          font-size: 1.8rem;
          color: #333;
          margin: 0;
        }

        .logo a {
          text-decoration: none;
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
          color: #555;
          font-weight: 500;
          transition: color 0.3s ease;
          padding: 0.5rem 0;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #ff6f61;
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 1rem; /* Default gap for larger screens */
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
          color: #ff6f61;
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
          color: #333;
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
          border-radius: 5px;
        }

        .dropdown-menu a:hover,
        .dropdown-menu button:hover {
          background-color: #f0f0f0;
        }

        .btn-logout {
          color: red;
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
          background-color: #333;
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
            background-color: #fff;
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
            border-bottom: 1px solid #eee;
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .header-content {
            justify-content: space-between;
          }

          .user-actions {
            margin-left: auto;
            /* Allow buttons to wrap to next line if needed */
            flex-wrap: wrap;
            /* Adjust gap for buttons on mobile */
            gap: 0.5rem; /* Reduced gap */
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

          .user-actions {
            order: 3;
          }

          /* New breakpoint for very small mobile screens to stack buttons */
          @media (max-width: 480px) {
            .user-actions {
              flex-direction: column; /* Stack buttons vertically */
              align-items: stretch; /* Make them full width */
              gap: 0.8rem; /* Space between stacked buttons */
            }

            .user-actions .btn-outline,
            .user-actions .btn-primary {
              width: 100%; /* Make buttons take full width */
              text-align: center; /* Center text in full-width buttons */
              margin: 0; /* Remove any lingering margins */
            }
          }
        }
      `}</style>
    </header>
  );
};

export default Header;