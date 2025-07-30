import axios from 'axios';
import React, { useState } from 'react';
import { useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { productContext } from '../../context/ProductContext';

const AdressForm = ({fetchAddress}) => {
  const {token,user_url}=useContext(productContext)

  const [form, setForm] = useState({
    country: 'India',
    name: '',
    phoneNumber: '',
    pincode: '',
    house: '',
    street: '',
    city: '',
    state: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const { name, phoneNumber, pincode, house, street, city, state } = form;

  if (!name || !phoneNumber || !pincode || !house || !street || !city || !state) {
    alert('Please fill all required fields');
    return;
  }

  const addressText = `${house}, ${street}, ${city}, ${state} - ${pincode}`;

  // Call onAdd for UI display (optional)
  

  try {
    const res = await axios.post(`${user_url}/profile/newAddress`,
      {
        name,
        phoneNumber,
        house,
        street,
        city,
        state,
        pincode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ fix typo from "Barber" to "Bearer"
        },
      }
    );
    fetchAddress()

    console.log('✅ Address saved:', res.data);
  } catch (error) {
    console.error('❌ Upload error:', error.response?.data || error.message);
  }

  // Reset form after successful add
  setForm({
    country: 'India',
    name: '',
    phoneNumber: '',
    pincode: '',
    house: '',
    street: '',
    city: '',
    state: '',
  });
};


  return (
    <div
      style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        padding: '30px',
        margin: '10px 0px',
      }}
      className="address_form"
    >
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Country/Region</Form.Label>
          <Form.Select name="country" value={form.country} onChange={handleChange}>
            <option>India</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Australia</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Full name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mobile number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Mobile number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Pincode</Form.Label>
          <Form.Control
            type="text"
            placeholder="6-digit PIN code"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Flat, House no., Building, Apartment</Form.Label>
          <Form.Control
            type="text"
            name="house"
            value={form.house}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Area, Street, Sector, Village</Form.Label>
          <Form.Control
            type="text"
            name="street"
            value={form.street}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" style={{ display: 'flex', gap: '10px' }}>
          <Form.Control
            type="text"
            placeholder="Town/City"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
          <Form.Select name="state" value={form.state} onChange={handleChange}>
            <option value="">Select State</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Delhi">Delhi</option>
          </Form.Select>
        </Form.Group>

        <Button
          type="submit"
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 40px',
            margin: '20px 0px',
          }}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AdressForm;
