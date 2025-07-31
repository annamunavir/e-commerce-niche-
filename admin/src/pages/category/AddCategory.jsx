import './addCategory.css'
import React, { useEffect, useState,useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';

const AddCategory = ({setNav}) => {
    useEffect(() => {
      setNav(false)
    }, [])

  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    image: null
  });
      const {user_url } = useContext(AuthContext);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('category', formData.category);
    payload.append('subCategory', formData.subCategory); // You can also split into array in backend
    payload.append('image', formData.image);

    try {
      const res = await axios.post(`${user_url}/api/categories`, payload);
      alert('✅ Category added successfully');
      setFormData({
        category: '',
        subCategory: '',
        image: null
      });
    } catch (err) {
      console.error('❌ Error adding category:', err.response?.data || err.message);
      alert('Failed to add category');
    }
  };

  return (
    <div className='category'>
    <Container className="add-category-container">
      <h3>Add New Category</h3>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group>
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Subcategories (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Category Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Add Category
        </Button>
      </Form>
    </Container>
    </div>
  );
};

export default AddCategory;
