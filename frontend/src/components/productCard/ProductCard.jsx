import React, { useContext, useEffect, useMemo, useState } from 'react';
import './productCard.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { BsHeart, BsHeartFill } from 'react-icons/bs'; // Bootstrap Heart icons
import { productContext } from '../../context/ProductContext';
import axios from 'axios';

const ProductCard = ({ product }) => {

  const { shortList, setShortList, user_url, token, fetchShortlist } = useContext(productContext);
  // console.log(user_url);
  
  if (!product) return null; // prevent crash

  const isLiked = shortList.some(p => p._id === product._id); // ✅ Works with array of objects
  // console.log("shortList", shortList, "current product:", product._id, "isLiked:", isLiked);


  const toggleShortlist = async (product) => {
    if (!token) return;

    try {
      //to check the product is already in wishlist or not
      const isShortlisted = shortList.some(p => p._id === product._id);
      
      //if the product already in whish list remove it from both side
      if (isShortlisted) {
        await axios.delete(`${user_url}/shortlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        //remove it from react state
        setShortList(prev =>
          prev.some(p => p._id === product._id)
            ? prev.filter(p => p._id !== product._id)
            : [...prev, { product }] 
        );
      } else {
        //if its not add the product to whish list in backend
        await axios.post(`${user_url}/shortlist/${product._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        //and fetch the whish list from backend 
        await fetchShortlist();

      }
    } catch (err) {
      console.error("❌ Error toggling shortlist:", err);
    }
  };


  const handleHeartClick = (e) => {
    e.preventDefault(); // Prevents navigation
    toggleShortlist(product);
  };




  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="product-card-container" style={{ position: 'relative', width: '16rem' }}>
        {/* Heart Icon */}
        <div
          className="heart-icon"
          onClick={handleHeartClick}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 2,
            fontSize: '1.5rem',
            color: isLiked ? 'red' : '#ccc',
            cursor: 'pointer'
          }}
        >
          {isLiked ? <BsHeartFill /> : <BsHeart />}
        </div>

        <Card style={{ width: '100%', textAlign: 'center' }}>
          <Card.Img
            className='card_img'
            variant="top"
            src={`${product ? product.image : "https://cdn.fcglcdn.com/brainbees/images/products/583x720/20523816a.webp"}`}
          />
          <Card.Body>
            <Card.Title >{product ? product.brand : 'nike'}</Card.Title>
            <Card.Text className="card-title" title={product.productName}>
              {product ? product.productName : 'Boys Striped Shirt & Shorts Set'}
            </Card.Text>
            <Card.Text style={{ textAlign: "center", fontSize: "16px", color: "black", padding: "8px 0px" }}>
              <i style={{ marginRight: "5px", color: 'yellow' }} className="bi bi-star-fill"></i>
              <span style={{ borderLeft: "1px solid", padding: "3px" }}> {product?.averageRating ? product.averageRating.toFixed(1) : "0.0"}</span>
            </Card.Text>
            <Card.Text style={{ fontSize: "18px", fontWeight: "500" }}>
              ${product.offerPrice ? product.offerPrice : product.price} <span style={{ textDecoration: "line-through", color: "red", fontWeight: "400" }}>{product?.offerPrice ? '$' + product.price : ""}</span>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Link>
  );
};

export default ProductCard;



