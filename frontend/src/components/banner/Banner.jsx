import React, { useEffect, useState, useContext } from 'react';
import './banner.css';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productContext } from '../../context/ProductContext';

const Banner = () => {
  const [offerProducts, setOfferProducts] = useState([]);
  const { allProducts } = useContext(productContext);

  useEffect(() => {
    const filtered = allProducts.filter(
      (product) => product.offerPercentage && product.offerPercentage > 0
    );
    setOfferProducts(filtered);
  }, [allProducts]);

  if (offerProducts.length === 0) {
    return (
      <div className="banner_container">
        <h1>No Deals Available</h1>
      </div>
    );
  }

  return (
    <div className="banner_container">
      <Carousel interval={3000} pause={false} className="custom_carousel">
        {offerProducts.map((product, index) => (
          <Carousel.Item key={index}>
            <div className="slide_content">
              <img className="slide_image" src={product.image} alt={product.productName} />
              <div className="slide_text">
                <h3>{product.offerPercentage}% OFF on</h3>
                <p>{product.productName}</p>
                <Link to={`/product/${product._id}`}>
                  <button className="explore_button">Explore</button>
                </Link>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
