import React, { useRef, useEffect, useState, useContext } from 'react';
import './category.css';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import axios from 'axios';
import { productContext } from '../../context/ProductContext';
import { Link } from 'react-router-dom';

const Category = () => {
  const scrollRef = useRef();
  const { setCategory,navigate ,url} = useContext(productContext);
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${url}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick =(category)=>{
    setCategory(category)
    navigate('/products')
  }

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 250;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-wrapper  my-4 px-2">
      <div className="mb-4"><h2>Categories</h2></div>

      {/* Arrows */}
      <button className="scroll-btn left" style={{marginLeft:"30px"}} onClick={() => scroll('left')}>
        <BsChevronLeft />
      </button>

      <div  className="category-scroll d-flex " ref={scrollRef}>
        {categories.map((cat, index) => (
          <div key={index} onClick={()=>handleCategoryClick(cat.category)}  className="text-center mx-3 category-item">
            <img src={cat.image} alt={cat.category} className="category_img img-fluid rounded" />
            <p className="category_name mt-2">{cat.category}</p>
          </div>
        ))}
      </div>

      <button className="scroll-btn right" style={{marginRight:"30px"}}  onClick={() => scroll('right')}>
        <BsChevronRight />
      </button>
    </div>
  );
};

export default Category;
