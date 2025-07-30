import React from 'react';
import './footer.css'
import './footer.css';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-top">
          <Col xs={12} md={4}>
            <h5>About Us</h5>
            <p>
              Welcome to KidsStore – your one-stop shop for all things baby and child. From fashion to toys, we’ve got everything your little one needs!
            </p>
          </Col>

          <Col xs={6} md={4}>
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><a href="/shop">Shop</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </Col>

          <Col xs={6} md={4}>
            <h5>Contact Info</h5>
            <p>Email: support@kidsstore.com</p>
            <p>Phone: +91-9876543210</p>
            <div className="footer-social">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </Col>
        </Row>

        <Row className="footer-bottom">
          <Col className="text-center mt-3">
            <p>&copy; {new Date().getFullYear()} KidsStore. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
