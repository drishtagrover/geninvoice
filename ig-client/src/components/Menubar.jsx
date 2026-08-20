import { useContext, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { AppContext, initialInvoiceData } from "../context/AppContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import Logo from './Logo';
import AuthModal from './AuthModal';

function MenuBar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const { setInvoiceData, setSelectedTemplate, setInvoiceTitle } = useContext(AppContext);

  const handleGenerateClick = () => {
    setInvoiceData(initialInvoiceData);
    setSelectedTemplate("template1");
    setInvoiceTitle("New Invoice");
    navigate("/generate");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container py-2">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <Logo />
          <span className='fw-bolder fs-4 mx-3' style={{letterSpacing: '-0.5px', color: '#0D6EFDB2'}}>
             GenInvoice
          </span>
        </Link>
        <button
        className='navbar-toggler'
        type='button'
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls='navbarNav'
        aria-expanded="false"
        aria-label="Toggle navigation" >
        <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className='navbar-nav ms-auto align-items-center'>
              <li className='nav-item'>
                <Link className='nav-link fw-medium' to="/"> Home</Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className='nav-item'>
                    <Link className='nav-link fw-medium' to="/dashboard"> Dashboard</Link>
                  </li>
                  <li className='nav-item'>
                    <button className="nav-link fw-medium" onClick={handleGenerateClick}> Generate</button>
                  </li>
                  <li className='nav-item dropdown'>
                    <button className="btn btn-link nav-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                      {user?.email || "User"}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                    </ul>
                  </li>
                </>
              ) : (
                <li className='nav-item'>
                  <button className="btn btn-primary rounded-pill px-4" onClick={() => setShowAuth(true)}>
                    Login / Sign Up
                  </button>
                </li>
              )}
            </ul>
          </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </nav>
  );
}

export default MenuBar
