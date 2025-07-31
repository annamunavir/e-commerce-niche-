import React, { useEffect, useState,useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import './editProduct.css';

const subcategoryMap = {
  Toys: ['Educational', 'Soft Toys', 'Remote Control', 'Outdoor'],
  Fashion: ['Winter Wear', 'Summer Wear', 'Party Wear'],
  Footwear: ['Sandals', 'Shoes', 'Boots'],
  KidsGrocery: ['Books', 'Bags', 'Stationery', 'Baby Food'],
  MomsAndMaternity: ['Feeding', 'Prenatal Care', 'Clothing'],
  BabyEssentials: ['Diapers', 'Creams', 'Wipes'],
  Nursery: ['Cribs', 'Chairs', 'Tables', 'Mat'],
  BathAndSkinCare: ["SkinCare", "BathEssentials"]
};

const EditProduct = ({ setNav }) => {
  const [newImage, setNewImage] = useState(null); // ✅ single image file

  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    brand: '',
    price: '',
    offerPercentage: '',
    stock: '',
    category: '',
    subcategory: '',
    ageGroup: '',
    gender: '',
    // color: '',
    // size: '',
    image: null
  });


  useEffect(() => {
    setNav(false);
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/products/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'offerPercentage' && value === '' ? null : value,
      ...(name === 'category' && { subcategory: '' }),
    }));
  };





  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append all fields EXCEPT image
    for (let key in formData) {
      if (key !== 'image') {
        data.append(key, formData[key]);
      }
    }

    // Append image ONLY if it's a File (new image uploaded)
    if (formData.image instanceof File) {
      data.append('image', formData.image); // ✅ multer will handle this
    }

    // ✅ Log what you're sending
    console.log('⬇️ PUT Triggered');
    console.log('🧾 FormData content:');
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/products/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Response:', response.data);
      alert('Product updated successfully!');
      navigate('/products');
    } catch (error) {
      console.error('❌ Upload error:', error.response?.data || error.message);
      alert('Upload failed');
    }
  };

  const subcategoryOptions = subcategoryMap[formData.category] || [];

  return (
    <div className='edit_product'>
      <div style={{ width: "80%" }}>
        <Container className="mt-4">
          <div style={{ textAlign: "center", marginBottom: "10px" }}><h2>Edit Product</h2></div>
          <Form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="productName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control value={formData.productName} className='form_input' type="text" name="productName" onChange={handleChange} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="brand">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control value={formData.brand} className='form_input' type="text" name="brand" onChange={handleChange} />
                </Form.Group>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control value={formData.price} className='form_input' type="number" name="price" onChange={handleChange} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="stock">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control value={formData.stock} className='form_input' type="number" name="stock" onChange={handleChange} />
                </Form.Group>
              </div>
            </div>



            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control value={formData.category} className='form_input' as="select" name="category" onChange={handleChange} required>
                    <option value="">-- Select Category --</option>
                    {Object.keys(subcategoryMap).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="subcategory">
                  <Form.Label>Subcategory</Form.Label>
                  <Form.Control value={formData.subcategory} className='form_input' as="select" name="subcategory" onChange={handleChange} disabled={!formData.category} >
                    <option value="">-- Select Subcategory --</option>
                    {subcategoryOptions.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="ageGroup">
                  <Form.Label>Age Group</Form.Label>
                  <Form.Control value={formData.ageGroup} className='form_input' as="select" name="ageGroup" onChange={handleChange} >
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
                  <Form.Control value={formData.gender} className='form_input' as="select" name="gender" onChange={handleChange} >
                    <option value="">-- Select Gender --</option>
                    <option>Unisex</option>
                    <option>Boys</option>
                    <option>Girls</option>
                    <option>Ladies</option>
                  </Form.Control>
                </Form.Group>
              </div>
            </div>

            {/* <div className="row mb-3">
              <div className="col-md-6">
                <Form.Group controlId="color">
                  <Form.Label>Color</Form.Label>
                  <Form.Control value={formData.color} className='form_input' as="select" name="color" onChange={handleChange} required>
                    <option value="">-- Select Color --</option>
                    <option>Red</option>
                    <option>Blue</option>
                    <option>Green</option>
                    <option>Yellow</option>
                    <option>Pink</option>
                    <option>Purple</option>
                    <option>Black</option>
                    <option>White</option>
                    <option>Brown</option>
                    <option>Gray</option>
                    <option>Multicolor</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="size">
                  <Form.Label>Size</Form.Label>
                  <Form.Control value={formData.size} className='form_input' as="select" name="size" onChange={handleChange}>
                    <option value="">-- Select Size --</option>
                    <option>Free Size</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                    <option>XXL</option>
                    <option>XXXL</option>
                  </Form.Control>
                </Form.Group>
              </div>
            </div> */}

            <div className="row mb-3">



              <div className='col-md-6'>
                <Form.Group controlId="OfferPrice">
                  <Form.Label>Offer Percentage</Form.Label>
                  <Form.Control className='form_input' type="number" name="offerPercentage" onChange={handleChange} />
                </Form.Group>
              </div>



              <div className='col-md-6'>
                <Form.Group controlId="image" className="mb-3">
                  <Form.Label>Upload New Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.files[0], // ✅ directly storing File object in formData.image
                      }));
                    }}

                  />
                </Form.Group>

              </div>
            </div>


            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control value={formData.description} className='form_input' as="textarea" rows={1} name="description" onChange={handleChange} />
            </Form.Group>
            <div style={{ textAlign: "center" }}> <Button className='button' type="submit" variant="primary">Submit Product</Button></div>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default EditProduct;
