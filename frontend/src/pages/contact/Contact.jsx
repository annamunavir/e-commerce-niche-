import React, { useState } from 'react';
import './contact.css'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './contact.css';
const Contact = () => {
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };
  return (
     <div className="contact-page">
      <Container>
        <h2 className="contact-heading text-center mb-5">Contact Us</h2>
        <Row className="g-4">
          <Col xs={12} md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="subject" className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="message" className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Write your message here..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button style={{backgroundColor:"black",border:"none"}} type="submit" className="w-100">
                Send Message
              </Button>
            </Form>
          </Col>

          <Col xs={12} md={6}>
            <div className="contact-info">
              <h5>Customer Support</h5>
              <p><strong>Phone:</strong> +91-9876543210</p>
              <p><strong>Email:</strong> support@kidsstore.com</p>
              <p><strong>Address:</strong> 123 Baby Street, Kids City, India</p>

              <h5 className="mt-4">Business Hours</h5>
              <p>Mon – Fri: 9:00 AM – 6:00 PM</p>
              <p>Sat: 10:00 AM – 4:00 PM</p>
              <p>Sun: Closed</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Contact