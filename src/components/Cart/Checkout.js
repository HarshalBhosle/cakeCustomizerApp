// Checkout.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import { saveOrder } from '../../services/cake.service';
import { getUserProfile } from '../../services/auth.service';

const Checkout = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    deliveryDate: '',
    deliveryTime: '12:00',
    specialInstructions: '',
    paymentMethod: 'credit'
  });
  
  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (savedCart.length === 0) {
      navigate('/cart');
      return;
    }
    
    setCartItems(savedCart);
    
    // Load user profile if logged in
    const loadUserProfile = async () => {
      try {
        if (currentUser) {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
          
          // Pre-fill form with user data
          setFormData(prevData => ({
            ...prevData,
            name: profile.name || '',
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            zipCode: profile.zipCode || ''
          }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    
    loadUserProfile();
    setLoading(false);
  }, [currentUser, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.totalPrice * (item.quantity || 1)), 0
    );
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderProcessing(true);
    
    try {
      // Calculate totals
      const subtotal = calculateSubtotal();
      const deliveryFee = 5;
      const total = subtotal + deliveryFee;
      
      // Create order object
      const orderData = {
        items: cartItems,
        customer: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone
        },
        delivery: {
          date: formData.deliveryDate,
          time: formData.deliveryTime,
          specialInstructions: formData.specialInstructions
        },
        payment: {
          method: formData.paymentMethod
        },
        pricing: {
          subtotal,
          deliveryFee,
          total
        },
        status: 'pending',
        createdAt: new Date()
      };
      
      // Save order to database
      const orderId = await saveOrder(currentUser.uid, orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Navigate to confirmation page
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error("Error processing order:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setOrderProcessing(false);
    }
  };
  
  if (loading) {
    return <div>Loading checkout...</div>;
  }
  
  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h2>Delivery Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input 
                  type="text" 
                  id="state" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input 
                  type="text" 
                  id="zipCode" 
                  name="zipCode" 
                  value={formData.zipCode} 
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange}
                required
              />
            </div>
          </section>
          
          <section className="form-section">
            <h2>Delivery Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deliveryDate">Delivery Date</label>
                <input 
                  type="date" 
                  id="deliveryDate" 
                  name="deliveryDate" 
                  value={formData.deliveryDate} 
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="deliveryTime">Preferred Time</label>
                <select 
                  id="deliveryTime" 
                  name="deliveryTime" 
                  value={formData.deliveryTime} 
                  onChange={handleInputChange}
                >
                  <option value="9:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="specialInstructions">Special Instructions</label>
              <textarea 
                id="specialInstructions" 
                name="specialInstructions" 
                value={formData.specialInstructions} 
                onChange={handleInputChange}
                rows="3"
              ></textarea>
            </div>
          </section>
          
          <section className="form-section">
            <h2>Payment Method</h2>
            
            <div className="payment-methods">
              <div className="payment-option">
                <input 
                  type="radio" 
                  id="creditCard" 
                  name="paymentMethod" 
                  value="credit" 
                  checked={formData.paymentMethod === "credit"}
                  onChange={handleInputChange}
                />
                <label htmlFor="creditCard">Credit Card</label>
              </div>
              
              <div className="payment-option">
                <input 
                  type="radio" 
                  id="paypal" 
                  name="paymentMethod" 
                  value="paypal" 
                  checked={formData.paymentMethod === "paypal"}
                  onChange={handleInputChange}
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
              
              <div className="payment-option">
                <input 
                  type="radio" 
                  id="cashOnDelivery" 
                  name="paymentMethod" 
                  value="cash" 
                  checked={formData.paymentMethod === "cash"}
                  onChange={handleInputChange}
                />
                <label htmlFor="cashOnDelivery">Cash on Delivery</label>
              </div>
            </div>
            
            {/* Credit card fields would be added conditionally here */}
            {formData.paymentMethod === "credit" && (
              <div className="credit-card-fields">
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input type="text" id="cardNumber" required />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input type="text" id="expiryDate" placeholder="MM/YY" required />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" required />
                  </div>
                </div>
              </div>
            )}
          </section>
          
          <button 
            type="submit" 
            className="btn-primary place-order-btn"
            disabled={orderProcessing}
          >
            {orderProcessing ? "Processing..." : "Place Order"}
          </button>
        </form>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="items-summary">
            {cartItems.map(item => (
              <div className="summary-item" key={item.id}>
                <div className="item-name">
                  {item.flavor.name} Cake ({item.size.name})
                  {item.quantity > 1 && ` x${item.quantity}`}
                </div>
                <div className="item-price">
                  ${(item.totalPrice * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="price-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>$5.00</span>
            </div>
            
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(calculateSubtotal() + 5).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;