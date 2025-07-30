import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Image } from 'react-bootstrap';
import axios from 'axios';
import './editCategories.css'
const EditCategory = ({ setNav }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    image: '',
  });
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    setNav(false);
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/categories/${id}`);
      setFormData({
        category: res.data.category,
        subCategory: res.data.subCategory.join(', '),
        image: res.data.image,
      });
    } catch (err) {
      console.error('Failed to fetch category:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNewImageFile(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sendData = new FormData();
      sendData.append('category', formData.category);
      sendData.append('subCategory', formData.subCategory);

      if (newImageFile) {
        sendData.append('image', newImageFile);
      }

      const res = await axios.put(`http://localhost:3000/api/categories/${id}`, sendData);
      alert('✅ Category updated successfully!');
      navigate('/categories');
    } catch (err) {
      console.error('Update error:', err);
      alert('❌ Update failed!');
    }
  };

  return (
    <div className='editCategory'>
    <Container className="edit-category mt-4">
      <h2>Edit Category</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formCategory">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formSubCategory">
          <Form.Label>Subcategories (comma separated)</Form.Label>
          <Form.Control
            type="text"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            placeholder="e.g. Toys, Fashion, Books"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formImage">
          <Form.Label>Category Image</Form.Label>
          <Form.Control type="file" name="image" onChange={handleChange} />
          {formData.image && (
            <div className="preview mt-2">
              <Image src={formData.image} width={100} thumbnail />
            </div>
          )}
        </Form.Group>

        <Button type="submit" variant="primary">
          Update Category
        </Button>
      </Form>
    </Container>
    </div>
  );
};

export default EditCategory;
