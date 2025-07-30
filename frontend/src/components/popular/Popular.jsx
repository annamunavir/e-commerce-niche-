import React, { useRef, useContext } from 'react';
import './popular.css';
import ProductCard from '../productCard/ProductCard';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { productContext } from '../../context/ProductContext';

const Popular = () => {
  const scrollRef = useRef();
  const { allProducts } = useContext(productContext);

  // ✅ Filter products with averageRating >= 3
  const popularProducts = allProducts.filter((p) => p.averageRating >= 3);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const cardWidth = container.firstChild.offsetWidth + 10; // card width + gap
    const scrollAmount = cardWidth * 4;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div  className='popular_products'>
      <h2 className='heading'>Popular Products</h2>

      <div className="popular_row">
        <button className="arrow-side" onClick={() => scroll('left')}>
          <BsChevronLeft />
        </button>

        <div className="products-wrapper">
          <div className="products" ref={scrollRef}>
            {popularProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>

        <button className="arrow-side" onClick={() => scroll('right')}>
          <BsChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Popular;
