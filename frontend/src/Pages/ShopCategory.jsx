import React, { useState, useEffect } from 'react';
import './CSS/ShopCategory.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Item from '../Components/Item/Item';

const ShopCategory = ({ category }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:4000/products/${category}`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });
  }, [category]);

  return (
    <div className='shop-category'>
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
      <div className="shopcategory-products">
        {products.map((item, i) => (
          <Link key={i} to={`/product/${item.id}`} className="product-item">
            <Item
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ShopCategory;

