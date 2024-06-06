import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/product/${productId}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the product!', error);
      });
  }, [productId]);

  return (
    <div>
      {product ? (
        <>
          <Breadcrum product={product} />
          <ProductDisplay product={product} />
          <DescriptionBox />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Product;
