// 📦 Import dependencies
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { productContext } from '../../context/ProductContext';
import Rating from '@mui/material/Rating';
import { toast } from 'react-toastify';
import './order.css';

const Orders = () => {
  const { token ,url} = useContext(productContext);
  

  const [orders, setOrders] = useState([]);
  const [review, setReview] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});
  const [editingReview, setEditingReview] = useState([]);

  // 🔢 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Display 2 orders per page

  // 🚚 Fetch orders and reviews
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${url}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data);

        const productIds = new Set();
        res.data.forEach(order => {
          order.orderItems.forEach(item => {
            if (item.product?._id) productIds.add(item.product._id);
          });
        });

        for (let productId of productIds) {
          try {
            const response = await axios.get(
              `${url}/products/${productId}/myreview`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
              const { _id, rating, review } = response.data;
              setSubmittedReviews(prev => ({
                ...prev,
                [productId]: { reviewId: _id, rating, text: review },
              }));
            }
          } catch (err) {
            if (err.response?.status !== 404) {
              console.error(`❌ Error fetching review for product ${productId}`, err);
            }
          }
        }
      } catch (err) {
        console.error('❌ Failed to fetch orders', err);
        toast.error('Could not load orders');
      }
    };

    setCurrentPage(1);
    fetchOrders();
  }, [token]);

  // ⭐ Handle rating change
  const handleRatingChange = (productId, value) => {
    setReview(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating: value,
      },
    }));
  };

  // 📝 Handle text change
  const handleReviewTextChange = (productId, text) => {
    setReview(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        text,
      },
    }));
  };

  // 🆕 Submit review
  const submitNewReview = async (productId, data) => {
    try {
      const response = await axios.post(
        `${url}/products/${productId}/review`,
        { rating: data.rating || 0, review: data.text || '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reviewId = response.data.reviewId;
      setSubmittedReviews(prev => ({
        ...prev,
        [productId]: { reviewId, rating: data.rating, text: data.text },
      }));
      setEditingReview(prev => prev.filter(id => id !== productId));
      toast.success('Review submitted!');
    } catch (err) {
      console.error('❌ Review submission failed:', err);
      toast.error('Review submission failed');
    }
  };

  // ✏️ Update review
  const updateReview = async (productId, data, reviewId) => {
    try {
      await axios.put(
        `${url}/products/${productId}/review/${reviewId}`,
        { rating: data.rating || 0, review: data.text || '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmittedReviews(prev => ({
        ...prev,
        [productId]: { reviewId, rating: data.rating, text: data.text },
      }));
      setEditingReview(prev => prev.filter(id => id !== productId));
      toast.success('Review updated!');
    } catch (err) {
      console.error('❌ Review update failed:', err);
      toast.error('Review update failed');
    }
  };

  const handleSubmitReview = async (productId) => {
    const data = review[productId];
    if (!data || (!data.text && !data.rating)) {
      toast.error('Please provide a rating or review');
      return;
    }

    const existing = submittedReviews[productId];
    if (existing) {
      await updateReview(productId, data, existing.reviewId);
    } else {
      await submitNewReview(productId, data);
    }
  };

  const toggleEdit = (productId) => {
    const isEditing = editingReview.includes(productId);
    setEditingReview(prev =>
      isEditing ? prev.filter(id => id !== productId) : [...prev, productId]
    );

    if (!isEditing && submittedReviews[productId]) {
      setReview(prev => ({
        ...prev,
        [productId]: {
          rating: submittedReviews[productId].rating,
          text: submittedReviews[productId].text,
        },
      }));
    }
  };

  // 🔢 Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="container py-4">
      <h4 className="text-center mb-4">Your Orders</h4>

      {paginatedOrders.map((order, index) => (
        <div key={index} className="card mb-4 shadow-sm p-3">
          <div className="row mb-2">
            <div className="col-md-6">
              <p><strong>Order ID:</strong> {order._id}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Status:</strong> {order.deliveryStatus}</p>
            </div>
          </div>

          {order.orderItems.map((item, idx) => {
            const product = item.product;
            if (!product) return null;
            const productId = product._id;
            const submitted = submittedReviews[productId];
            const isEditing = editingReview.includes(productId);

            return (
              <div key={idx} className="row border-top pt-3 mt-2">
                <div className="col-md-6">
                  <img style={{ width: '50px' }} src={product.image} alt="" />
                  <h6>{product.productName}</h6>
                  <p>Quantity: {item.quantity}</p>
                </div>

                {order.deliveryStatus === 'delivered' && (
                  <div className="col-md-6">
                    {submitted && !isEditing ? (
                      <div>
                        <p><strong>Your Rating:</strong></p>
                        <Rating value={submitted.rating} precision={1} readOnly />
                        <p className="mt-2"><strong>Your Review:</strong><br />{submitted.text}</p>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => toggleEdit(productId)}
                        >✏️ Edit</button>
                      </div>
                    ) : (
                      <div>
                        <label className="form-label">Rate this product:</label>
                        <Rating
                          value={review[productId]?.rating || 0}
                          precision={1}
                          onChange={(e, val) => handleRatingChange(productId, val)}
                        />
                        <textarea
                          className="form-control mt-2"
                          rows="2"
                          placeholder="Write your review..."
                          value={review[productId]?.text || ''}
                          onChange={(e) => handleReviewTextChange(productId, e.target.value)}
                        />
                        <button
                          onClick={() => handleSubmitReview(productId)}
                          className="btn btn-sm btn-primary mt-2"
                        >
                          {submitted ? 'Update Review' : 'Submit Review'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* 🔘 Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination d-flex justify-content-center gap-2 mt-4 flex-wrap">
          <button
            className="btn btn-outline-dark btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &laquo; Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              className={`btn btn-sm ${currentPage === num ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}

          <button
            className="btn btn-outline-dark btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
