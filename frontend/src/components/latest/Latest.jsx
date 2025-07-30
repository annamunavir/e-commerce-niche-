import React, { useRef, useContext } from 'react';
import './latest.css';
import ProductCard from '../productCard/ProductCard';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { productContext } from '../../context/ProductContext';

const Latest = () => {
  const scrollRef = useRef();
  const { allProducts } = useContext(productContext);

  const latestProducts = [...allProducts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10); // latest 10

  const scroll = (direction) => {
    const container = scrollRef.current;
    const card = container.firstChild;

    if (!card) return;

    const cardWidth = card.offsetWidth + 10;

    let scrollAmount;
    if (window.innerWidth < 576) {
      scrollAmount = cardWidth * 1;
    } else if (window.innerWidth < 768) {
      scrollAmount = cardWidth * 2;
    } else {
      scrollAmount = cardWidth * 4;
    }

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className='latest_products'>
      <h2 className='heading'>Latest Products</h2>

      <div className="latest_row">
        <button  className="arrow-side" onClick={() => scroll('left')}>
          <BsChevronLeft />
        </button>

        <div className="products-wrapper">
          <div className="products" ref={scrollRef}>
            {latestProducts.map((product, index) => (
              <ProductCard product={product} key={index} />
            ))}
          </div>
        </div>

        <button  className="arrow-side" onClick={() => scroll('right')}>
          <BsChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Latest;
