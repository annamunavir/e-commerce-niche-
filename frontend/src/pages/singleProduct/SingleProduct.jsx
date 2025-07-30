import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import './singleProduct.css';
import axios from 'axios';
import ProductCard from '../../components/productCard/ProductCard';
import { Container, Row, Col, Image, Button, Spinner, Form } from 'react-bootstrap';
import { productContext } from '../../context/ProductContext';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user_url, url,setCart, token, cart, fetchCart, allProducts } = useContext(productContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [ratingValue, setRatingValue] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
console.log(reviews);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollLeft -= 300;
  };

  const scrollRight = () => {
    scrollRef.current.scrollLeft += 300;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${url}/products/${id}`);
        setProduct(response.data);
        setRatingValue(response.data.averageRating || 0);

        const related = allProducts.filter(
          (p) => p.category === response.data.category && p._id !== response.data._id
        );
        setRelatedProducts(related.slice(0, 20));
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching product:', err.message);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${url}/products/${id}/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch reviews", err);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id, allProducts]);
    console.log(cart);
    
  const addToCart = async (product) => {
    try {
      const existingItem = cart.find(item => item.product._id === product._id);

      if (existingItem) {
        toast.info("🛒 Already in cart!");
        const newQuantity = existingItem.quantity + 1;

        await axios.put(`${user_url}/cart/update/${product._id}`, { quantity: newQuantity }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await fetchCart();
        toast.info("🛒 Quantity updated in cart!");
      } else {
        await axios.post(`${user_url}/cart/add/${product._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await fetchCart();
        toast.success("✅ Product added to cart!");
      }
      navigate("/");
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      toast.error("❌ Failed to add product to cart.");
    }
  };

  if (loading) {
    return <div className="loader"><Spinner animation="border" variant="primary" /></div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ marginTop: "30px", marginBottom: "100px" }}>
        <Container className="single-product">
          <Row>
            <Col md={6}>
              <Image style={{ width: '400px' }} src={product.image} fluid className="product-image" />
            </Col>
            <Col md={6}>
              <h2>{product.productName}</h2>
              <p className="brand">{product.brand}</p>
              <p>{product.description}</p>
              <div className="price">
                <span className="current-price">₹{product.offerPrice || product.price}</span>
                {product.offerPrice && (
                  <span style={{ textDecoration: "line-through", marginLeft: "20px", color: "red" }} className="original-price">{product.price}</span>
                )}
              </div>

              {/* 🔵 Size Selector */}
              <div className="size-selector">
                <strong>Select Size:</strong>
                <div className="size-options">
                  {sizes.map((size) => (
                    <div
                      key={size}
                      className={`size-circle ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>

              {/* ⭐ Rating Display */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <Rating
                  name="read-only-rating"
                  value={ratingValue}
                  readOnly
                  precision={0.5}
                  size="medium"
                />
                <Typography variant="body2" color="textSecondary">
                  ({product.numReviews || 0})
                </Typography>
              </div>

              <Button onClick={() => addToCart(product)} variant="primary">
                Add to Cart
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

     {/* ✅ Related Products Section */}
<div className="container-fluid related_items py-4">
  <h2 className="text-center mb-4">Related Products</h2>

  <div className="d-flex align-items-center overflow-auto scroll-container px-3" style={{ position: "relative" }} ref={scrollRef}>
    {/* Scroll Left Button */}
    <button
      className="scroll-btn left d-none d-md-block me-3"
      onClick={scrollLeft}
      style={{
        fontSize: "16px",
        width: "50px",
        height: "50px",
        borderRadius: "100%",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
      }}
    >
      {'<'}
    </button>

    {/* Product Cards */}
    <div className="d-flex flex-wrap justify-content-center gap-3 w-100">
      {relatedProducts.map((pro, i) => (
        <div
          key={i}
          className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center scroll-item"
        >
          <ProductCard product={pro} />
        </div>
      ))}
    </div>

    {/* Scroll Right Button */}
    <button
      className="scroll-btn right d-none d-md-block ms-3"
      onClick={scrollRight}
      style={{
        fontSize: "16px",
        width: "50px",
        height: "50px",
        borderRadius: "100%",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
      }}
    >
      {'>'}
    </button>
  </div>
</div>

{/* ✅ Product Reviews Section */}
<div className="container mt-5 review">
  <h3 className="text-center mb-4">Customer Reviews</h3>

  {reviews.length === 0 ? (
    <p className="text-center">No reviews yet.</p>
  ) : (
    reviews.map((r, idx) => (
      <div
        key={idx}
        className="col-12 mb-3 border-bottom pb-3"
      >
        <strong>{r.user?.userName || 'Anonymous'}</strong>
        <div><Rating value={r.rating} readOnly size="small" /></div>
        <p className="mt-2">{r.review}</p>
      </div>
    ))
  )}
</div>

    </div>
  );
};

export default SingleProduct;
