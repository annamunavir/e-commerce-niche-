import React, { useContext, useState, useEffect } from 'react';
import './sidebar.css';
import axios from 'axios';
import { productContext } from '../../context/ProductContext';

const Sidebar = () => {
  const { setCategory, setSubCategory, category, subCategory,categoriesData,setCategoriesData,url } = useContext(productContext);
  
  const [expandedCategory, setExpandedCategory] = useState(null);
//  console.log(categoriesData);
 
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await axios.get(`${url}/categories`);
  //       setCategoriesData(res.data); // Example: { category: 'Toys', subcategories: ['Cars', 'Blocks'] }
  //     } catch (err) {
  //       console.error('Failed to fetch categories:', err);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  const handleCategoryClick = (categoryName) => {
    setExpandedCategory((prev) => (prev === categoryName ? null : categoryName));
    setCategory(categoryName);
    setSubCategory(null); // Optional: clear previous subcategory
  };

  const handleSubcategoryClick = (subcategoryName) => {
    setSubCategory(subcategoryName);
    setCategory(null); // Optional: clear main category when a subcategory is selected
  };

  return (
    <div className="sidebar-container">
      <h5 className="mb-3">Categories</h5>
      {categoriesData.map((cat, index) => (
        <div key={index} className="mb-2">
          <div
            className={`category-title ${category === cat.category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.category)}
          >
            {cat.category}
          </div>
{/* {console.log(cat.subCategory)}     */}
          {expandedCategory === cat.category && (
            <ul className="subcategory-list">
              {cat.subCategory.map((sub, i) => (
                  <li
                    key={i}
                    className={subCategory === sub ? 'active-sub' : ''}
                    onClick={() => handleSubcategoryClick(sub)}
                  >
                    {sub}
                  </li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
