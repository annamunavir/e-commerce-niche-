import React, { useState, useContext } from 'react';
import './login.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { IoLogIn } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const { setToken, setShowLoginPopup, showLoginForm, setShowLoginForm,user_url } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [signUpData, setSignUpData] = useState({
    userName: "",
    email: "",
    password: ""
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

 const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${user_url}/login`, loginData);
    const token = response.data.token;
    const role = response.data.role;

    localStorage.setItem("admintoken", token);
    localStorage.setItem("role", role);
    setToken(token);
    // setShowLoginPopup(false);

    if (role === 'admin') {
      setShowLoginPopup(false)
      navigate('/');
    } else {
     alert("admin only")
      
    }
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
};


  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${user_url}/register`, signUpData);
      console.log(response.data.message); // ✅ Fix: use .data
      setShowLoginForm(true);
      alert("Registration successful! You can now log in.");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className='login_popup'>
      <div style={{ display: "flex" }}>
        <h2><IoLogIn size={25} /> {showLoginForm ? 'Login' : 'Signup'}</h2>
      </div>

      <Form onSubmit={showLoginForm ? handleLoginSubmit : handleSignUpSubmit}>
        {!showLoginForm && (
          <Form.Group className="mb-3" controlId="formBasicUserName">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              onChange={handleSignUpChange}
              name='userName'
              type="text"
              placeholder="Enter username"
              required
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={showLoginForm ? handleLoginChange : handleSignUpChange}
            name='email'
            type="email"
            placeholder="Enter email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={showLoginForm ? handleLoginChange : handleSignUpChange}
            name='password'
            type="password"
            placeholder="Password"
            required
          />
        </Form.Group>

        <Button
          style={{ backgroundColor: "rgb(96, 86, 35)", border: "none" }}
          type="submit"
        >
          {showLoginForm ? 'Login' : 'Signup'}
        </Button>

        <p style={{ marginTop: '10px' }}>
          {showLoginForm ? (
            <>Don't have an account?{' '}
              <span
                onClick={() => setShowLoginForm(false)}
                style={{ color: 'blue', cursor: 'pointer' }}
              >
                Signup
              </span>
            </>
          ) : (
            <>Already have an account?{' '}
              <span
                onClick={() => setShowLoginForm(true)}
                style={{ color: 'blue', cursor: 'pointer' }}
              >
                Login
              </span>
            </>
          )}
        </p>
      </Form>
    </div>
  );
};

export default Login;
