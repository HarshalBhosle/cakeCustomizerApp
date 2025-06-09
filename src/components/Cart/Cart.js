// Cart.js
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    setLoading(false);
  }, []);
  
  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.totalPrice * (item.quantity || 1)), 0
    );
  };
  
  const proceedToCheckout = () => {
    if (!currentUser) {
      // Store intended destination
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };
  
  if (loading) {
    return <div>Loading cart...</div>;
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any cakes to your cart yet.</p>
        <Link to="/" className="btn-primary">Start Creating Your Cake</Link>
      </div>
    );
  }
  
  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div className="cart-item" key={item.id}>
            <div className="item-preview">
              {/* Simplified cake preview */}
              <div className="cake-color" style={{ backgroundColor: item.flavor.colorCode }}></div>
            </div>
            
            <div className="item-details">
              <h3>{item.flavor.name} Cake</h3>
              <p><strong>Size:</strong> {item.size.name}</p>
              <p>
                <strong>Toppings:</strong> 
                {item.toppings.length > 0 
                  ? item.toppings.map(t => t.name).join(', ') 
                  : 'None'}
              </p>
            </div>
            
            <div className="item-quantity">
              <button 
                onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                disabled={(item.quantity || 1) <= 1}
              >
                -
              </button>
              <span>{item.quantity || 1}</span>
              <button onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}>
                +
              </button>
            </div>
            
            <div className="item-price">
              ${((item.totalPrice) * (item.quantity || 1)).toFixed(2)}
            </div>
            
            <button 
              className="remove-item"
              onClick={() => handleRemoveItem(item.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="summary-row">
          <span>Items ({cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}):</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
        
        <div className="summary-row">
          <span>Delivery:</span>
          <span>$5.00</span>
        </div>
        
        <div className="summary-row total">
          <span>Total:</span>
          <span>${(calculateTotal() + 5).toFixed(2)}</span>
        </div>
        
        <button 
          className="btn-primary checkout-btn"
          onClick={proceedToCheckout}
        >
          Proceed to Checkout
        </button>
        
        <Link to="/" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;

