import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/navbar';
import SubscriptionCard from './components/subcard';
import Cart from './components/cart';
import Login from './components/Login';
import CreditCard from './components/CreditCard';
import list from './data';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCreditCard, setShowCreditCard] = useState(false);
  const [warning, setWarning] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const userAuth = localStorage.getItem('userAuth');
    if (userAuth) {
      try {
        const user = JSON.parse(userAuth);
        setIsAuthenticated(user.loggedIn);
      } catch (error) {
        console.error('Error parsing user auth:', error);
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('eztechCart');
    
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
      } catch (error) {
        console.error('Error parsing cart:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('eztechCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  const addToCart = (item) => {
    const isSubscription = item.id <= 4;
    const hasSubscription = cartItems.some(cartItem => cartItem.id <= 4);

    if (isSubscription && hasSubscription) {
      setWarning('You can only add one subscription at a time. Please remove your current subscription first.');
      setTimeout(() => setWarning(''), 4000);
      return;
    }

    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      if (isSubscription) {
        setWarning('This subscription is already in your cart.');
        setTimeout(() => setWarning(''), 4000);
        return;
      }
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCreditCard(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <Navbar 
        cartCount={getTotalItems()} 
        onCartClick={() => setShowCart(!showCart)}
        onLogout={handleLogout}
      />
      
      {warning && (
        <div className="warning-banner">
          <span className="warning-icon">⚠️</span>
          {warning}
        </div>
      )}

      <div className="main-content">
        <div className="hero-section">
          <h1>StreamList</h1>
          <p className="tagline">Your Watch, Plan, and Stream Hub</p>
        </div>

        <section className="subscriptions-section">
          <h2>Choose Your Subscription</h2>
          <div className="subscription-grid">
            {list.filter(item => item.id <= 4).map(item => (
              <SubscriptionCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                isInCart={cartItems.some(cartItem => cartItem.id === item.id)}
              />
            ))}
          </div>
        </section>

        <section className="accessories-section">
          <h2>EZTech Accessories</h2>
          <div className="accessories-grid">
            {list.filter(item => item.id > 4).map(item => (
              <SubscriptionCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                isInCart={cartItems.some(cartItem => cartItem.id === item.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {showCart && (
        <Cart
          items={cartItems}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          totalPrice={getTotalPrice()}
          onCheckout={handleCheckout}
        />
      )}

      {showCreditCard && (
        <CreditCard
          onClose={() => setShowCreditCard(false)}
          onSaveCard={(card) => {
            console.log('Card saved:', card);
          }}
        />
      )}
    </div>
  );
}

export default App;