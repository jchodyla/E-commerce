import React, { useContext, useState } from 'react';
import ShopContext from '../Context/ShopContext';
import axios from 'axios';

const OrderPage = () => {
    const { cart, user } = useContext(ShopContext);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handlePlaceOrder = () => {
        const totalCost = cart.reduce((total, item) => total + item.productId.price * item.quantity, 0);
        const items = cart.map(item => ({ productId: item.productId._id, quantity: item.quantity }));

        axios.post('/place-order', {
            items,
            totalCost,
            paymentMethod,
            deliveryAddress
        }).then(response => {
            setOrderPlaced(true);
            console.log('Order placed:', response.data);
        }).catch(error => {
            console.error('Error placing order:', error);
        });
    };

    if (!user) {
        return <div>Please log in to place an order.</div>;
    }

    return (
        <div>
            <h1>Place Order</h1>
            {orderPlaced ? (
                <div>Order has been placed successfully!</div>
            ) : (
                <div>
                    <h2>Cart Items</h2>
                    {cart.map(item => (
                        <div key={item.productId._id}>
                            <h3>{item.productId.name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.productId.price}</p>
                        </div>
                    ))}
                    <h2>Order Details</h2>
                    <label>
                        Payment Method:
                        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                            <option value="">Select</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Cash on Delivery">Cash on Delivery</option>
                        </select>
                    </label>
                    <label>
                        Delivery Address:
                        <input
                            type="text"
                            value={deliveryAddress}
                            onChange={e => setDeliveryAddress(e.target.value)}
                        />
                    </label>
                    <h2>Total Cost: ${cart.reduce((total, item) => total + item.productId.price * item.quantity, 0)}</h2>
                    <button onClick={handlePlaceOrder}>Place Order</button>
                </div>
            )}
        </div>
    );
};

export default OrderPage;
