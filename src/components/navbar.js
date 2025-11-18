import React from 'react';
import './navbar.css';

function Navbar({ cartCount, onCartClick, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>EZTechMovie</h2>
          <span className="brand-subtitle">StreamList</span>
        </div>
        
        <div className="navbar-menu">
  <a href="#subscriptions" className="nav-link">Subscriptions</a>
  <a href="#accessories" className="nav-link">Accessories</a>
  
  <button className="logout-btn" onClick={onLogout}>
    Logout
  </button>
  
  <button className="cart-button" onClick={onCartClick}>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
  </button>
</div>
      </div>
    </nav>
  );
}

export default Navbar;