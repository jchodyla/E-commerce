import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/orders', {
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="orders">
      <h1>Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-item">
            <h2>Order ID: {order._id}</h2>
            <p>Address: {order.address}</p>
            <p>Delivery Type: {order.deliveryType}</p>
            <p>Payment Type: {order.paymentType}</p>
            <p>Total Price: ${order.totalPrice}</p>
            <p>Date: {new Date(order.date).toLocaleString()}</p>
            <h3>Products:</h3>
            <ul>
              {order.products.filter(product => product.quantity > 0).map(product => (
                <li key={product.productId}>
                  Product ID: {product.productId}, Quantity: {product.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

