import React, { useContext, useState, useEffect } from 'react';
import './header.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { CgProfile } from 'react-icons/cg';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  MdAddToPhotos, MdAddCircleOutline,
} from "react-icons/md";
import {
  RiLogoutCircleLine, RiDiscountPercentLine
} from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { FaBoxOpen } from "react-icons/fa";
import {
  AiOutlineUnorderedList, AiOutlineAppstore
} from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";

const Header = () => {
  const { token, showLoginPopup, setShowLoginPopup, setToken, setShowLoginForm } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProductSub, setShowProductSub] = useState(false);
  const [showCategorySub, setShowCategorySub] = useState(false);

  const handleLogout = () => {
    setToken('');
    setShowLoginForm(true);
    setShowLoginPopup(true);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (!e.target.closest('.profile-wrapper')) {
        setDropdownOpen(false);
        setShowProductSub(false);
        setShowCategorySub(false);
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary header">
        <Container>
          <Navbar.Brand href="/">Bun Bear</Navbar.Brand>
          <Nav className="ms-auto">
            {!token ? (
              <Nav.Link>
                <CgProfile onClick={() => setShowLoginPopup(!showLoginPopup)} />
              </Nav.Link>
            ) : (
              <div className="profile-wrapper" style={{ position: 'relative' }}>
                <img
                  src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
                  alt="profile"
                  className="profile-img"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  style={{ width: 30, height: 30, borderRadius: '50%', cursor: 'pointer' }}
                />
                {dropdownOpen && (
                  <div className="mobile-dropdown">
                    <Link to="/" onClick={() => setDropdownOpen(false)}>
                      <MdAddToPhotos /> Dashboard
                    </Link>

                    <div className="dropdown-label" onClick={() => setShowProductSub(prev => !prev)}>
                      <FaBoxOpen /> Product
                    </div>
                    {showProductSub && (
                      <>
                        <Link to="/add" onClick={() => setDropdownOpen(false)}>
                          <MdAddCircleOutline /> Add Product
                        </Link>
                        <Link to="/products" onClick={() => setDropdownOpen(false)}>
                          <AiOutlineUnorderedList /> Products
                        </Link>
                        <Link to="/offers" onClick={() => setDropdownOpen(false)}>
                          <RiDiscountPercentLine /> Offer Products
                        </Link>
                      </>
                    )}

                    <div className="dropdown-label" onClick={() => setShowCategorySub(prev => !prev)}>
                      <BiCategoryAlt /> Category
                    </div>
                    {showCategorySub && (
                      <>
                        <Link to="/addCategories" onClick={() => setDropdownOpen(false)}>
                          <MdAddCircleOutline /> Add Category
                        </Link>
                        <Link to="/categories" onClick={() => setDropdownOpen(false)}>
                          <AiOutlineAppstore /> Categories
                        </Link>
                      </>
                    )}

                    <Link to="/orders" onClick={() => setDropdownOpen(false)}>
                      <TbTruckDelivery /> Orders
                    </Link>

                    <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
                      <RiLogoutCircleLine /> Logout
                    </span>
                  </div>
                )}
              </div>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
