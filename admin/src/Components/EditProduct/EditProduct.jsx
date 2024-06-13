import React, { useState } from 'react';
import './EditProduct.css'

const EditProduct = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState(product);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedProduct = { ...formData };

    if (imageFile) {
      const formData = new FormData();
      formData.append('product', imageFile);

      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        updatedProduct.image = result.image_url;
      }
    }

    onSave(updatedProduct);
  };

  return (
    <div className="editproduct">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Old Price:
          <input
            type="number"
            name="old_price"
            value={formData.old_price}
            onChange={handleChange}
          />
        </label>
        <label>
          New Price:
          <input
            type="number"
            name="new_price"
            value={formData.new_price}
            onChange={handleChange}
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </label>
        <label>
          Image:
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
          />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProduct;
