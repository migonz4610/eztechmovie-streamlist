import React from 'react';
import './subcard.css';

function SubscriptionCard({ item, onAddToCart, isInCart }) {
  return (
    <div className="subscription-card">
      <div className="card-image-container">
        <img src={item.img} alt={item.service} className="card-image" />
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{item.service}</h3>
        <p className="card-description">{item.serviceInfo}</p>
        
        <div className="card-footer">
          <div className="price-section">
            <span className="price">${item.price}</span>
            <span className="price-period">/month</span>
          </div>
          
          <button 
            className={`add-button ${isInCart ? 'in-cart' : ''}`}
            onClick={() => onAddToCart(item)}
          >
            {isInCart ? (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                In Cart
              </>
            ) : (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionCard;