import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { productContext } from '../../context/ProductContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import './profile.css';

const ProfilePage = () => {
  const { token, user_url, setSubNav } = useContext(productContext);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    avatar: '',
    initials: '',
    avatarColor: '',
    phone: '',
    addresses: {
      house: '', street: '', city: '', state: '', pincode: '', country: ''
    }
  });

  // console.log(user);
  
  const navigate = useNavigate();

  useEffect(() => {
    setSubNav(false);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${user_url}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      const profile = res.data.profile;

      setForm({
        fullName: profile.fullName || '',
        avatar: profile.avatar || '',
        initials: res.data.initials || '',
        avatarColor: res.data.avatarColor || '',
        phone: profile.phone || '',
        addresses: profile.addresses?.[0] || {
          house: '', street: '', city: '', state: '', pincode: '', country: ''
        }
      });
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['house', 'street', 'city', 'state', 'pincode', 'country'].includes(name)) {
      setForm((prev) => ({
        ...prev,
        addresses: { ...prev.addresses, [name]: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('fullName', form.fullName);
    formData.append('phone', form.phone);
    formData.append('addresses', JSON.stringify([form.addresses]));

    if (form.avatarFile) {
      formData.append('avatar', form.avatarFile);
    }

    try {
      await axios.put(`${user_url}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile updated');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Container style={{minHeight:"100vh"}} className="py-4">
      <div className="row justify-content-center ">
        <div className="col-md-7">
          <Card className="profile-card p-4">
            <div className="text-center mb-4">
              {form.avatar ? (
                <img src={form.avatar} alt="Avatar" className="profile-avatar mb-3" width={100} height={100} />
              ) : (
                <div className="profile-avatar-placeholder mb-3" style={{ backgroundColor: form.avatarColor || '#ccc' }}>
                  {form.initials || 'NA'}
                </div>
              )}
              <h4>{user.userName}</h4>
              <p>{user.email}</p>
            </div>

            {editing ? (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" name="fullName" value={form.fullName} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" name="phone" value={form.phone} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Avatar</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        avatarFile: e.target.files[0],
                      }))
                    }
                  />
                </Form.Group>

                <h6 className="mt-4 mb-2">Address</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Country/Region</Form.Label>
                  <Form.Select name="country" value={form.addresses.country} onChange={handleChange}>
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="6-digit PIN code"
                    name="pincode"
                    value={form.addresses.pincode}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Flat, House no., Building, Apartment</Form.Label>
                  <Form.Control
                    type="text"
                    name="house"
                    value={form.addresses.house}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Area, Street, Sector, Village</Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    value={form.addresses.street}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="mb-3 d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Town/City"
                    name="city"
                    value={form.addresses.city}
                    onChange={handleChange}
                  />
                  <Form.Select name="state" value={form.addresses.state} onChange={handleChange}>
                    <option value="">Select State</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Delhi">Delhi</option>
                  </Form.Select>
                </div>

                <div className="profile-button-group">
                  <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            ) : (
              <>
                <p><strong>Full Name:</strong> {form.fullName || ""}</p>
                <p><strong>Phone:</strong> {form.phone || ""}</p>

                <h6>Saved Address:</h6>
                <p>
                  {form.addresses.house}<br />
                  {form.addresses.street}<br />
                  {form.addresses.city} - {form.addresses.pincode}<br />
                  {form.addresses.state}, {form.addresses.country}
                </p>

                <div className="profile-button-group">
                  <Button variant="outline-primary" onClick={() => setEditing(true)}>Edit Profile</Button>
                  <Button variant="success" onClick={() => navigate('/orders')}>
                    <FaShoppingCart className="me-2" /> My Orders
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;
