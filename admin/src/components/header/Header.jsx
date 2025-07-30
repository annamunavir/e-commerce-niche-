import React, { useContext } from 'react';
import './header.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { CgProfile } from 'react-icons/cg';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { token, showLoginPopup, setShowLoginPopup } = useContext(AuthContext);
console.log(token);

  return (
    <Navbar expand="lg" className="bg-body-tertiary header">
      <Container>
        <Navbar.Brand href="/">Bun Bear</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!token ? (
              <Nav.Link>
                <CgProfile onClick={() => setShowLoginPopup(!showLoginPopup)} />
              </Nav.Link>
            ) : (
              <Nav.Link>
                <img
                  className='profile_img'
                  src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
                  alt="profile"
                  
                />
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
