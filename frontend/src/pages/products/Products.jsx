import './products.css';
import React, { useContext, useEffect, useState } from 'react';
import { productContext } from '../../context/ProductContext';
import ProductCard from '../../components/productCard/ProductCard';
import Sidebar from '../../components/sidebar/Sidebar';
import { BsFilter } from 'react-icons/bs';
import { Form, Button } from 'react-bootstrap';

const Products = () => {
  const {
    category,
    allProducts,
    subCategory,
    setSubNav,
    searchTerm,
    handleSearch,
    searchProducts
  } = useContext(productContext);

  // 🔹 Local states
  const [filterProduct, setFilterProduct] = useState([]);  // All filtered products
  const [showSidebar, setShowSidebar] = useState(false);   // Mobile filter toggle

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(1);       // Current active page
  const itemsPerPage = 8;                                   // Number of products per page

  // 🔸 Disable subnav on mount
  useEffect(() => {
    setSubNav(false);
  }, []);

  // 🔸 Filtering logic (runs on filters/search change)
  useEffect(() => {
    let filtered = [];

    if (searchTerm.trim() !== '') {
      filtered = searchProducts || [];  // Use searched results
    } else if (subCategory) {
      filtered = allProducts.filter(
        (product) =>
          product.subcategory?.toLowerCase() === subCategory.toLowerCase()
      );
    } else if (category) {
      filtered = allProducts.filter(
        (product) => product.category === category
      );
    } else {
      filtered = allProducts;
    }

    setCurrentPage(1);           // Reset to page 1 on new filter
    setFilterProduct(filtered);  // Set the full filtered product list
  }, [category, subCategory, allProducts, searchTerm, searchProducts]);

  // 🔸 Get products to show for current page
  const totalPages = Math.ceil(filterProduct.length / itemsPerPage);  // Total pages
  const startIndex = (currentPage - 1) * itemsPerPage;                 // Start index
  const endIndex = startIndex + itemsPerPage;                         // End index
  const currentItems = filterProduct.slice(startIndex, endIndex);    // Current page items

  // 🔸 Pagination buttons
  const renderPagination = () => {
    if (totalPages <= 1) return null;  // Don't show if only 1 page

    const pageNumbers = [...Array(totalPages).keys()].map(n => n + 1);

    return (
      <div style={{margin:"15px"}} className="pagination d-flex justify-content-center gap-2 mt-4 flex-wrap">
        {/* ⏮ Prev Button */}
        <Button
          variant="outline-dark"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          &laquo; Prev
        </Button>

        {/* 🔢 Page Numbers */}
        {pageNumbers.map((num) => (
          <Button
            key={num}
            variant={num === currentPage ? 'dark' : 'outline-dark'}
            size="sm"
            onClick={() => setCurrentPage(num)}
          >
            {num}
          </Button>
        ))}

        {/* ⏭ Next Button */}
        <Button
          variant="outline-dark"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next &raquo;
        </Button>
      </div>
    );
  };

  return (
    <div className="products-page">
      {/* 📦 Sidebar (Filter) */}
      <div className={`sidebar-wrapper ${showSidebar ? 'show' : ''}`}>
        <Sidebar />
      </div>

      {/* 📦 Right Side Content */}
      <div className="products-content">

        {/* 🔍 Mobile Filter Toggle */}
        <div className="filter-toggle d-lg-none">
          <button onClick={() => setShowSidebar(!showSidebar)}>
            <BsFilter size={20} />
            Filter
          </button>
        </div>

        {/* 🔍 Search Input */}
        <div className="search-bar-container">
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {/* 🛍 Product Grid */}
        <div className="products-container row">
          {currentItems.length === 0 ? (
            <div className="col-12 text-center mt-4">
              <p>No products found.</p>
            </div>
          ) : (
            currentItems.map((product, index) => (
              <div
                key={index}
                className="product-col col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4"
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>

        {/* 🔢 Pagination Controls */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default Products;
