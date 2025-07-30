import './about.css'
import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import './about.css';

const About = () => {
  return (
    <div className="about-page">
      <Container>
        <h2 className="about-heading text-center mb-5">About Us</h2>

        {/* Who We Are */}
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <Image
              className='about-img'
              src="https://i.pinimg.com/736x/51/39/5d/51395dd445c241c8777e93e39aa9bb40.jpg"
              fluid
              rounded
              alt="About KidsStore"
            />
          </Col>
          <Col md={6}>
            <h4>Who We Are</h4>
            <p>
              KidsStore is your go-to destination for quality kids’ products – from stylish clothing to essential care items. We're passionate about delivering joy and convenience to parents through trusted brands and adorable picks for children of all ages.
            </p>
          </Col>
        </Row>

        {/* Why Shop With Us */}
        <Row className="align-items-center flex-md-row-reverse">
          <Col md={6}>
            <Image
              className='about-img'
              src="https://i.pinimg.com/736x/2b/3d/3c/2b3d3cc2cc729750c974e8aac0b548c5.jpg"
              fluid
              rounded
              alt="Happy parents shopping"
            />
          </Col>
          <Col md={6}>
            <h4>Why Shop With Us?</h4>
            <p>
              We understand that parenting can be a challenge — so we’ve built a store that’s curated, caring, and customer-first. With fast delivery, top-notch customer support, and affordable prices, KidsStore makes shopping for your little one stress-free and fun.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
