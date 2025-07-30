import React, { forwardRef, useContext, useEffect, useState } from 'react';
import './header.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { productContext } from '../../context/ProductContext';
import { PiBabyCarriageFill } from "react-icons/pi";
import Swal from 'sweetalert2';
import axios from 'axios';

// ✅ Custom Toggle without arrow
const CustomToggle = forwardRef(({ onClick, children }, ref) => (
  <span
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ cursor: 'pointer' }}
  >
    {children}
  </span>
));

const Header = () => {
  const { token, setToken, user_url, navigate } = useContext(productContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get(`${user_url}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
    }
  }, [token]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        setToken('');
        Swal.fire('Logged Out!', 'You have been logged out.', 'success');
        navigate('/login');
      }
    });
  };

  return (
    <Navbar expand="lg" className="header" sticky="top">
      <Container>
        <Navbar.Brand href="/">
          <PiBabyCarriageFill size={28} />
          <span style={{ color: "whitesmoke", fontSize: "30", fontFamily: "cursive" }}>niche</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-auto">
            <Nav.Link href="#home"><Link to='/'>Home</Link></Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#link"><Link to='/contact'>Contact</Link></Nav.Link>
            <Nav.Link href="#category"><Link to="/products">Products</Link></Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle as={CustomToggle} id="dropdown-profile">
                {token && user ? (
                  user.profile.avatar ? (
                    <img
                      src={user.profile.avatar}
                      alt="Profile"
                      className="profile-img"
                    />
                  ) : (
                    <div
                      className="profile-avatar-placeholder"
                      style={{
                        backgroundColor: user.profile.avatarColor || '#999',
                        color: '#fff',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      {user.profile.initials || 'NA'}
                    </div>
                  )
                ) : (
                  <div className="profile-icon">
                    <i className="bi bi-person-circle fs-4"></i>
                  </div>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {!token ? (
                  <Dropdown.Item onClick={() => navigate('/login')}>
                    <i className="bi bi-box-arrow-in-right me-2"></i> Login
                  </Dropdown.Item>
                ) : (
                  <>
                    <Dropdown.Item onClick={() => navigate('/profile')}>
                      <i className="bi bi-person-lines-fill me-2"></i> Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
