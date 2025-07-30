import React, { useContext, useEffect, useState } from 'react';
import './subHeader.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { BiSearch, BiCart, BiHeart } from 'react-icons/bi';
import { productContext } from '../../context/ProductContext';
import { Link } from 'react-router-dom';

const SubHeader = () => {
  const { categoriesData,setCategory,navigate,searchTerm,handleSearch,cart}=useContext(productContext)
  
return (
    <Navbar expand="lg" className="subheader-navbar">
      <Container className="d-flex justify-content-between align-items-center mb-0">
        
        {/* Left: Empty placeholder or logo if needed */}
        <div style={{ width: '40px' }}></div>

        {/* Center: Search Bar */}
        <InputGroup style={{ maxWidth: '500px', width: '100%' }}>
          <FormControl
            placeholder="Search products..."
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearch}
          
          />
          <Button variant="outline-secondary">
            <BiSearch size={20} />
          </Button>
        </InputGroup>

        {/* Category Dropdown */}
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-category">
            Categories
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {categoriesData.map((category, index) => (
              <Dropdown.Item onClick={()=>setCategory(category.category,navigate("/products"))} key={index}>
                {category.category}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {/* Right: Cart and Favorite Icons */}
        <div className="nav-icons d-flex gap-3 align-items-center">
          <Link to="/wishList"><BiHeart size={24} className="nav-icon" /></Link>
          <div className="cart-icon position-relative">
           <Link to='/cart'><BiCart size={24} className="nav-icon" /></Link> 
            {Array.isArray(cart) && cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default SubHeader;
