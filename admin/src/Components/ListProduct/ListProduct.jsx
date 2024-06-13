import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from '../Assets/cross_icon.png';
import EditProduct from '../EditProduct/EditProduct.jsx';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchInfo = () => {
    fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    fetchInfo();
  };

  const saveProduct = async (updatedProduct) => {
    const formData = new FormData();
    Object.keys(updatedProduct).forEach((key) => {
      formData.append(key, updatedProduct[key]);
    });

    await fetch('http://localhost:4000/updateproduct', {
      method: 'POST',
      body: formData,
    });

    fetchInfo();
    setEditingProduct(null);
  };

  return (
    <div className="listproduct">
      <h1>All Products List</h1>
      {editingProduct ? (
        <EditProduct
          product={editingProduct}
          onSave={saveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      ) : (
        <>
          <div className="listproduct-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Old Price</p>
            <p>New Price</p>
            <p>Category</p>
            <p>Actions</p>
          </div>
          <div className="listproduct-allproducts">
            <hr />
            {allproducts.map((e) => (
              <div key={e.id}>
                <div className="listproduct-format-main listproduct-format">
                  <img className="listproduct-product-icon" src={e.image} alt="" />
                  <p className="cartitems-product-title">{e.name}</p>
                  <p>${e.old_price}</p>
                  <p>${e.new_price}</p>
                  <p>{e.category}</p>
                  <button onClick={() => setEditingProduct(e)}>Edit</button>
                  <img className="listproduct-remove-icon" onClick={() => { removeProduct(e.id); }} src={cross_icon} alt="" />
                </div>
                <hr />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ListProduct;
