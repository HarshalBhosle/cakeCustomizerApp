// src/components/Dashboard/OrderHistory.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import api from '../../services/api';

const OrderHistory = () => {
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/orders?userId=${currentUser.uid}`);
        setOrders(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load order history. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  if (isLoading && orders.length === 0) {
    return <div className="loading">Loading order history...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="order-history empty-state">
        <h2>Order History</h2>
        <p>You haven't placed any orders yet.</p>
        <button className="btn-primary">Start Shopping</button>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="order-details">
        <button onClick={handleBackToList} className="back-button">
          ← Back to All Orders
        </button>
        
        <h2>Order #{selectedOrder.orderNumber}</h2>
        <div className="order-meta">
          <div className="order-date">
            <span className="label">Placed on:</span>
            <span className="value">{formatDate(selectedOrder.createdAt)}</span>
          </div>
          <div className="order-status">
            <span className="label">Status:</span>
            <span className={`value ${getStatusClass(selectedOrder.status)}`}>
              {selectedOrder.status}
            </span>
          </div>
          <div className="order-total">
            <span className="label">Total:</span>
            <span className="value">${selectedOrder.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="shipping-info">
          <h3>Shipping Information</h3>
          <p>{selectedOrder.shippingAddress.name}</p>
          <p>{selectedOrder.shippingAddress.street}</p>
          <p>
            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
            {selectedOrder.shippingAddress.zip}
          </p>
          <p>{selectedOrder.shippingAddress.country}</p>
        </div>

        <div className="items-list">
          <h3>Items</h3>
          {selectedOrder.items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-image">
                <img src={item.imageUrl} alt={item.name} />
              </div>
              <div className="item-details">
                <h4>{item.name}</h4>
                <p className="item-description">{item.description}</p>
                <div className="item-meta">
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ${item.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${selectedOrder.subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>${selectedOrder.shippingCost.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span>${selectedOrder.tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${selectedOrder.total.toFixed(2)}</span>
          </div>
        </div>

        {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Completed' && (
          <button className="btn-secondary">Cancel Order</button>
        )}
        <button className="btn-primary">Reorder</button>
      </div>
    );
  }

  return (
    <div className="order-history">
      <h2>Order History</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="order-card" 
            onClick={() => handleOrderSelect(order)}
          >
            <div className="order-header">
              <span className="order-number">Order #{order.orderNumber}</span>
              <span className={`order-status ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="order-summary">
              <div className="date-placed">
                <span className="label">Placed on:</span>
                <span className="value">{formatDate(order.createdAt)}</span>
              </div>
              <div className="items-count">
                <span className="label">Items:</span>
                <span className="value">{order.items.length}</span>
              </div>
              <div className="order-total">
                <span className="label">Total:</span>
                <span className="value">${order.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="order-preview">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.id} className="item-preview">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="more-items">+{order.items.length - 3}</div>
              )}
            </div>
            
            <button className="view-details">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;