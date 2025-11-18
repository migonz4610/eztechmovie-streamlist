import React, { useState, useEffect } from 'react';
import './CreditCard.css';

function CreditCard({ onClose, onSaveCard }) {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [savedCards, setSavedCards] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('savedCards');
    if (saved) {
      setSavedCards(JSON.parse(saved));
    }
  }, []);

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardData({
        ...cardData,
        cardNumber: formatCardNumber(value)
      });
      setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCardData({
        ...cardData,
        expiryDate: formatExpiryDate(value)
      });
      setErrors({ ...errors, expiryDate: '' });
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCardData({
        ...cardData,
        cvv: value
      });
      setErrors({ ...errors, cvv: '' });
    }
  };

  const validateCard = () => {
    const newErrors = {};
    
    if (cardData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!cardData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
    if (cardData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    } else {
      const [month, year] = cardData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (cardData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    
    if (validateCard()) {
      const newCard = {
        id: Date.now(),
        ...cardData,
        maskedNumber: '**** **** **** ' + cardData.cardNumber.slice(-4),
        savedDate: new Date().toISOString()
      };
      
      const updatedCards = [...savedCards, newCard];
      setSavedCards(updatedCards);
      localStorage.setItem('savedCards', JSON.stringify(updatedCards));
      
      if (onSaveCard) {
        onSaveCard(newCard);
      }
      
      setCardData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
      });
      
      alert('Card saved successfully!');
    }
  };

  const handleDeleteCard = (id) => {
    const updatedCards = savedCards.filter(card => card.id !== id);
    setSavedCards(updatedCards);
    localStorage.setItem('savedCards', JSON.stringify(updatedCards));
  };

  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'Amex';
    return 'Card';
  };

  return (
    <div className="credit-card-overlay">
      <div className="credit-card-modal">
        <div className="credit-card-header">
          <h2>Payment Methods</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="credit-card-content">
          <div className="add-card-section">
            <h3>Add New Card</h3>
            
            <form onSubmit={handleSaveCard}>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={handleCardNumberChange}
                  className={errors.cardNumber ? 'error' : ''}
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>

              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="JOHN DOE"
                  value={cardData.cardName}
                  onChange={(e) => {
                    setCardData({ ...cardData, cardName: e.target.value.toUpperCase() });
                    setErrors({ ...errors, cardName: '' });
                  }}
                  className={errors.cardName ? 'error' : ''}
                />
                {errors.cardName && <span className="error-message">{errors.cardName}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiryDate}
                    onChange={handleExpiryChange}
                    className={errors.expiryDate ? 'error' : ''}
                  />
                  {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={handleCvvChange}
                    maxLength="3"
                    className={errors.cvv ? 'error' : ''}
                  />
                  {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                </div>
              </div>

              <button type="submit" className="save-card-btn">
                Save Card
              </button>
            </form>
          </div>

          {savedCards.length > 0 && (
            <div className="saved-cards-section">
              <h3>Saved Cards</h3>
              <div className="saved-cards-list">
                {savedCards.map((card) => (
                  <div key={card.id} className="saved-card-item">
                    <div className="card-info">
                      <div className="card-type">{getCardType(card.cardNumber)}</div>
                      <div className="card-number">{card.maskedNumber}</div>
                      <div className="card-name">{card.cardName}</div>
                      <div className="card-expiry">Expires {card.expiryDate}</div>
                    </div>
                    <button 
                      className="delete-card-btn"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreditCard;