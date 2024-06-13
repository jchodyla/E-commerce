import React from 'react';
import './Sidebar.css';
import add_product_icon from '../Assets/add-product.png';
import list_product_icon from '../Assets/products-icon.png';
import orders_icon from '../Assets/icon-order.png';
import users_icon from '../Assets/users-icon.png';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to='/addproduct' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="Add Product" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to='/listproduct' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="Product List" />
          <p>Product List</p>
        </div>
      </Link>
      <Link to='/orders' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={orders_icon} alt="Orders" />
          <p>Orders</p>
        </div>
      </Link>
      <Link to='/users' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={users_icon} alt="Users" />
          <p>Users</p>
        </div>
      </Link>
    </div>
  );
}

export default Sidebar;