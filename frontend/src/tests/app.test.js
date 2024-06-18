import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import Navbar from '../Components/Navbar/Navbar';
import CartItems from '../Components/CartItems/CartItems';

// Tests for App.js
test('App.js: renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// Tests for Navbar.jsx
test('Navbar.jsx: renders the Navbar component', () => {
  render(<Navbar />);
  const navElement = screen.getByRole('navigation');
  expect(navElement).toBeInTheDocument();
});

test('Navbar.jsx: renders the logo', () => {
  render(<Navbar />);
  const logoElement = screen.getByAltText('Logo');
  expect(logoElement).toBeInTheDocument();
});

// Tests for CartItems.jsx
test('CartItems.jsx: renders CartItems component', () => {
  render(<CartItems />);
  const cartItemsElement = screen.getByText(/cart items/i);
  expect(cartItemsElement).toBeInTheDocument();
});

test('CartItems.jsx: renders empty cart message', () => {
  render(<CartItems items={[]} />);
  const emptyCartMessage = screen.getByText(/your cart is empty/i);
  expect(emptyCartMessage).toBeInTheDocument();
});
