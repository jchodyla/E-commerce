import React, { useContext, useRef, useState, useEffect } from 'react';
import './Navbar.css';
import cart_icon from '../Assets/cart_icon.png';
import nav_dropdown from '../Assets/nav_dropdown.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const [menu, setMenu] = useState('shop');

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className='navbar'>
      <Link to='/' onClick={() => setMenu('shop')} className='nav-logo'>
        <p>TechWorld</p>
      </Link>
      <img onClick={dropdown_toggle} className='nav-dropdown' src={nav_dropdown} alt='' />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={() => setMenu('shop')}>
          <Link to='/'>Shop</Link>
          {menu === 'shop' && <hr />}
        </li>
        <li onClick={() => setMenu('laptops')}>
          <Link to='/laptops'>Laptops</Link>
          {menu === 'laptops' && <hr />}
        </li>
        <li onClick={() => setMenu('phones')}>
          <Link to='/phones'>Phones</Link>
          {menu === 'phones' && <hr />}
        </li>
        <li onClick={() => setMenu('accessories')}>
          <Link to='/accessories'>Accessories</Link>
          {menu === 'accessories' && <hr />}
        </li>
      </ul>
      <div className='nav-login-cart'>
        {user ? (
          <>
            <p className='logged-in-message'>Welcome {user.name}!</p> {}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to='/login'>
            <button>Login</button>
          </Link>
        )}
        <Link to='/cart'>
          <img src={cart_icon} alt='cart' />
        </Link>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;