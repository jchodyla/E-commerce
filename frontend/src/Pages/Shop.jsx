import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CSS/Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/allproducts');
      setProducts(response.data);
    } catch (error) {
      console.error('There was an error fetching the products!', error);
    }
  };

  const handleSearch = async () => {
    console.log('Search Term:', searchTerm);
    console.log('Min Price:', minPrice);
    console.log('Max Price:', maxPrice);
    
    const params = {};
    if (searchTerm) params.q = searchTerm;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    try {
      const response = await axios.get('http://localhost:4000/search', { params });
      console.log('Search Results:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('There was an error fetching the search results!', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="shop">
      <h1>All Products</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="search-input"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <div className="product-list">
        {products.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} className="product-item">
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.category}</p>
            <p>Price: ${product.new_price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shop;