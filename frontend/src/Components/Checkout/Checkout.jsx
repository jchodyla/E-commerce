import React, { useState, useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const { getTotalCartAmount, cartItems, all_product, setCartItems } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    address: '',
    deliveryType: 'standard',
    paymentType: 'creditCard'
  });
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    console.log('Placing order:', formData, cartItems);

    const orderDetails = {
      ...formData,
      cartItems,
      totalPrice: getTotalCartAmount(),
    };

    try {
      const response = await axios.post('http://localhost:4000/placeorder', orderDetails, {
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
        }
      });

      if (response.data.success) {
        console.log("Order placed successfully:", response.data.order);
        setCartItems(getDefaultCart(all_product));
        navigate('/');
      } else {
        console.error('Order placement failed', response.data.error);
      }
    } catch (error) {
      console.error('There was an error placing the order!', error);
    }
  };

  const getDefaultCart = (products) => {
    let cart = {};
    products.forEach(product => {
      cart[product.id] = 0;
    });
    return cart;
  };

  return (
    <div className='checkout'>
      <h1>Checkout</h1>
      <div className='checkout-form'>
        <label>
          Address:
          <input type='text' name='address' value={formData.address} onChange={changeHandler} />
        </label>
        <label>
          Delivery Type:
          <select name='deliveryType' value={formData.deliveryType} onChange={changeHandler}>
            <option value='standard'>Standard</option>
            <option value='express'>Express</option>
          </select>
        </label>
        <label>
          Payment Type:
          <select name='paymentType' value={formData.paymentType} onChange={changeHandler}>
            <option value='creditCard'>Credit Card</option>
            <option value='paypal'>PayPal</option>
            <option value='cashOnDelivery'>Cash on Delivery</option>
          </select>
        </label>
      </div>
      <h2>Total Price: ${getTotalCartAmount()}</h2>
      <button onClick={handleOrder}>Place Order</button>
    </div>
  );
};

export default Checkout;
