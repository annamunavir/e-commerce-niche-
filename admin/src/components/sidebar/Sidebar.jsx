import React, { useState, useContext } from 'react';
import './sidebar.css';
import { Link } from 'react-router-dom';
import { MdAddToPhotos, MdAddCircleOutline } from "react-icons/md";
import { RiLogoutCircleLine, RiDiscountPercentLine } from "react-icons/ri";
import { CiViewList } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb";
import { FaBoxOpen } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { AiOutlineUnorderedList, AiOutlineAppstore } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const {
    token,
    setToken,
    setShowLoginPopup,
    setShowLoginForm
  } = useContext(AuthContext);

  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const toggleProductDropdown = () => {
    setShowProductDropdown(!showProductDropdown);
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const handleLogout = () => {
    setToken('');
    setShowLoginForm(true);
    setShowLoginPopup(true);
  };

  return (
    <div className="admin_sidebar">
      <div className='sidebar'>
        <div className='sidebar_menu'>
          <ul>

            <li>
              <div className='menu'>
                <Link to='/'>
                  <MdAddToPhotos size={18} />
                  <span className='text-label'>Dashboard</span>
                </Link>
              </div>
            </li>

            {/* Product Dropdown */}
            <li onClick={toggleProductDropdown} className="dropdown-toggle">
              <div className="dropdown-header">
                <div className="menu">
                  <FaBoxOpen size={18} />
                  <span className='text-label'>Product</span>
                </div>
                <div className="dropdown-arrow">
                  {showProductDropdown ? <IoIosArrowDown /> : <IoIosArrowForward />}
                </div>
              </div>
            </li>

            {showProductDropdown && (
              <ul className='submenu'>
                <li>
                  <Link to='/add'>
                    <MdAddCircleOutline size={18} />
                    <span className='text-label'>Add Product</span>
                  </Link>
                </li>
                <li>
                  <Link to='/products'>
                    <AiOutlineUnorderedList size={18} />
                    <span className='text-label'>Products</span>
                  </Link>
                </li>
                <li>
                  <Link to='/offers'>
                    <RiDiscountPercentLine size={18} />
                    <span className='text-label'>Offer Products</span>
                  </Link>
                </li>
              </ul>
            )}

            {/* Category Dropdown */}
            <li onClick={toggleCategoryDropdown} className="dropdown-toggle">
              <div className="dropdown-header">
                <div className="menu">
                  <BiCategoryAlt size={18} />
                  <span className='text-label'>Category</span>
                </div>
                <div className="dropdown-arrow">
                  {showCategoryDropdown ? <IoIosArrowDown /> : <IoIosArrowForward />}
                </div>
              </div>
            </li>

            {showCategoryDropdown && (
              <ul className='submenu'>
                <li>
                  <Link to='/addCategories'>
                    <MdAddCircleOutline size={18} />
                    <span className='text-label'>Add Category</span>
                  </Link>
                </li>
                <li>
                  <Link to='/categories'>
                    <AiOutlineAppstore size={18} />
                    <span className='text-label'>Categories</span>
                  </Link>
                </li>
              </ul>
            )}

            {/* Orders */}
            <li>
              <div className='menu'>
                <Link to='/orders'>
                  <TbTruckDelivery size={18} />
                  <span className='text-label'>Orders</span>
                </Link>
              </div>
            </li>

          </ul>
        </div>

        {/* Logout */}
        <div className='sidebar_logout'>
          <ul>
            <li>
              <div className='menu'>
                <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  <RiLogoutCircleLine size={18} />
                  <span className='text-label'>Logout</span>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
