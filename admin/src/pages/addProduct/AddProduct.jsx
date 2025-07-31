import './addProduct.css';
import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = ({ setNav }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const {user_url } = useContext(AuthContext);


  useEffect(() => {
    setNav(false);

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${user_url}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    brand: '',
    price: '',
    offerPercentage: null,
    stock: '',
    category: '',
    subcategory: '',
    ageGroup: '',
    gender: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'offerPercentage' && value === '' ? null : value,
      ...(name === 'category' && { subcategory: '' }),
    }));

    if (name === 'category') {
      const found = categories.find((cat) => cat.category === value);
      setSubcategories(found?.subCategory || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    for (let key in formData) {
      if (key === 'image') continue;
      const value = formData[key];
      if (key === 'offerPercentage' && (value === null || value === '')) continue;
      if (['price', 'stock', 'offerPercentage'].includes(key)) {
        data.append(key, Number(value));
      } else {
        data.append(key, value);
      }
    }

    if (formData.image instanceof File) {
      data.append('image', formData.image);
    } else {
      alert("Please upload a valid image file.");
      return;
    }

    try {
      const res = await axios.post(`${user_url}/api/products`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Upload success:', res.data);
      alert('Product added successfully!');
      navigate('/products');
    } catch (error) {
      console.error('❌ Upload error:', error.response?.data || error.message);
      alert('Upload failed');
    }
  };

  return (
    <div className='add_product'>
      <div style={{ width: "80%" }}>
        <Container className="mt-4">
          <div style={{ textAlign: "center", marginBottom: "10px" }}><h2>Add Product</h2></div>
          <Form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="productName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control className='form_input' type="text" name="productName" onChange={handleChange} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="brand">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control className='form_input' type="text" name="brand" onChange={handleChange} required />
                </Form.Group>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control className='form_input' type="number" name="price" onChange={handleChange} required />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group controlId="offerPercentage">
                  <Form.Label>Offer Percentage</Form.Label>
                  <Form.Control className='form_input' type="number" name="offerPercentage" onChange={handleChange} />
                </Form.Group>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control className='form_input' as="select" name="category" onChange={handleChange} required>
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.category}>{cat.category}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="subcategory">
                  <Form.Label>Subcategory</Form.Label>
                  <Form.Control className='form_input' as="select" name="subcategory" onChange={handleChange} value={formData.subcategory} disabled={!formData.category}>
                    <option value="">-- Select Subcategory --</option>
                    {subcategories.map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="ageGroup">
                  <Form.Label>Age Group</Form.Label>
                  <Form.Control className='form_input' as="select" name="ageGroup" onChange={handleChange}>
                    <option value="">-- Select Age Group --</option>
                    <option>0-6 Months</option>
                    <option>6-12 Months</option>
                    <option>1-3 Years</option>
                    <option>3-6 Years</option>
                    <option>6-11 Years</option>
                    <option>11+ Years</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="gender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control className='form_input' as="select" name="gender" onChange={handleChange}>
                    <option value="">-- Select Gender --</option>
                    <option>Unisex</option>
                    <option>Boys</option>
                    <option>Girls</option>
                    <option>Ladies</option>
                  </Form.Control>
                </Form.Group>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="stock">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control className='form_input' type="number" name="stock" onChange={handleChange} />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group controlId="image" className="mb-3">
                  <Form.Label>Upload Product Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.files[0],
                      }));
                    }}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control className='form_input' as="textarea" rows={2} name="description" onChange={handleChange} />
            </Form.Group>

            <div style={{ textAlign: "center" }}>
              <Button className='button' type="submit" variant="primary">Submit Product</Button>
            </div>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default AddProduct;
