import './testimonial.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { productContext } from '../../context/ProductContext';

const defaultAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';

const Testimonial = () => {
  const scrollRef = useRef(null);
  const { url, token, user } = useContext(productContext);

  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({ feedback: '' });
  const [editing, setEditing] = useState(false);
  const [disableInput, setDisableInput] = useState(false);

  // ✅ Fetch all feedbacks on component mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${url}/feedback`);
        setTestimonials(res.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, [url]);

  // ✅ Scroll control
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ feedback: e.target.value });
  };

  // ✅ Handle feedback submit or edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const res = await axios.put(
          `${url}/feedback/edit`,
          { feedback: formData.feedback },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updated = testimonials.map((item) =>
          (item.user?._id || item._id) === user._id
            ? { ...item, feedback: res.data.feedback.feedback }
            : item
        );
        setTestimonials(updated);
        setEditing(false);
        setDisableInput(true);
      } else {
        const res = await axios.post(
          `${url}/feedback`,
          { feedback: formData.feedback },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // const newTestimonial = {
        //   feedback: formData.feedback,
        //   user: {
        //     _id: user._id,
        //     userName: user?.userName || 'Anonymous',
        //     profile: {
        //       avatar: user?.profile?.avatar || defaultAvatar,
        //     }
        //   }
        // };

        setTestimonials([res.data.feedback, ...testimonials]);
        setDisableInput(true);
      }

      setFormData({ feedback: '' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  // ✅ Handle edit icon click
  const handleEdit = (feedback) => {
    setFormData({ feedback });
    setEditing(true);
    setDisableInput(false);
  };

  // ✅ Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`${url}/feedback/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = testimonials.filter(
        (item) => (item.user?._id || item._id) !== user._id
      );
      setTestimonials(updated);
      setFormData({ feedback: '' });
      setEditing(false);
      setDisableInput(false);
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  return (
    <div className="testimonial-section">
      <Container>
        <h2 className="testimonial-heading text-center mb-5">What Our Customers Say</h2>

        <div className="testimonial-scroll-container">
          <button className="scroll-btn left" onClick={() => handleScroll('left')}>
            <FaChevronLeft />
          </button>

          <div className="testimonial-scroll" ref={scrollRef}>
            {testimonials.map((item, index) => {
              const name = item.name || item.user?.userName || 'Anonymous';
              const image = item.image || item.user?.profile?.avatar || defaultAvatar;

              return (
                <div className="testimonial-card-wrapper" key={index}>
                  <Card className="testimonial-card">
                    <Card.Img variant="top" src={image} className="testimonial-img" />
                    <Card.Body>
                      <Card.Title>{name}</Card.Title>
                      <Card.Text>"{item.feedback}"</Card.Text>

                      {/* ✅ Edit/Delete icons if it's user's feedback */}
                      {user && item.user?._id === user._id && (
                        <div className="d-flex justify-content-end gap-3">
                          <FaEdit
                            style={{ cursor: 'pointer' }}
                            title="Edit"
                            onClick={() => handleEdit(item.feedback)}
                          />
                          <FaTrash
                            style={{ cursor: 'pointer' }}
                            title="Delete"
                            onClick={handleDelete}
                          />
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </div>

          <button className="scroll-btn right" onClick={() => handleScroll('right')}>
            <FaChevronRight />
          </button>
        </div>

        {/* ✅ Testimonial Form */}
        <h4 className="text-center mt-5 mb-3">Leave Yours</h4>
        <Row className="justify-content-center">
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Your Feedback</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="feedback"
                  placeholder="Write your testimonial..."
                  value={formData.feedback}
                  onChange={handleChange}
                  disabled={disableInput}
                  required
                />
              </Form.Group>

              <Button style={{ background: 'black', border: 'none' }} type="submit" className="w-100">
                {editing ? 'Update Testimonial' : 'Submit Testimonial'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Testimonial;
