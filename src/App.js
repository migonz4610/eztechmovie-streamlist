import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/navbar';
import SubscriptionCard from './components/subcard';
import Cart from './components/cart';
import list from './data';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [warning, setWarning] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('🔵 Component mounted - Loading cart...');
    const savedCart = localStorage.getItem('eztechCart');
    console.log('🔵 Saved cart from localStorage:', savedCart);
    
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        console.log('🔵 Parsed cart items:', parsed);
        setCartItems(parsed);
      } catch (error) {
        console.error('❌ Error parsing cart:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('🟢 Saving to localStorage:', cartItems);
      localStorage.setItem('eztechCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (item) => {
    const isSubscription = item.id <= 4;
    const hasSubscription = cartItems.some(cartItem => cartItem.id <= 4);

    // Check if trying to add a subscription when one already exists
    if (isSubscription && hasSubscription) {
      setWarning('You can only add one subscription at a time. Please remove your current subscription first.');
      setTimeout(() => setWarning(''), 4000);
      return;
    }

    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      // For subscriptions, show warning
      if (isSubscription) {
        setWarning('This subscription is already in your cart.');
        setTimeout(() => setWarning(''), 4000);
        return;
      }
      // For accessories, increase quantity
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

  return (
    <div className="App">
      <Navbar 
        cartCount={getTotalItems()} 
        onCartClick={() => setShowCart(!showCart)}
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
        />
      )}
    </div>
  );
}

export default App;