import './loginComponent.css'
import React, { useContext, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { productContext } from '../../context/ProductContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginComponent = () => {
  const { setSubNav, setToken ,navigate,user_url} = useContext(productContext)
  const [loginForm, setLoginForm] = useState(true)
  const [formData, setFormData] = useState({ userName: "", email: "", password: "" })
  useEffect(() => {
    setSubNav(false)
  }, [])




 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let response;
    if (loginForm) {
      const { email, password } = formData;
      response = await axios.post(`${user_url}/login`, { email, password });
    } else {
      response = await axios.post(`${user_url}/register`, formData);
    }
    const role = response.data.role
    const TOKEN = response.data.token;
    
    if (TOKEN) {
      localStorage.setItem('token', TOKEN);
      localStorage.setItem('role',role)
      setToken(TOKEN);
      navigate("/")
    }
    "✅ Product added to cart!"
     toast.success(loginForm ? '✅Welcome back' : '✅Welcome');
   

  } catch (error) {
    console.log("error: ", error);
    alert(error.response?.data?.message || "Something went wrong");
  }
};



  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div className='login_container'>
      <div className='login'>
        <h1 className='title' style={{ textAlign: "center", margin: "50px 0px", color: "rgb(12, 59, 69) " }}>{loginForm ? "Login" : "SignUp"}</h1>
        <div className='login_form'>
          <Form onSubmit={handleSubmit}  >
            {
              !loginForm ? <Form.Group className="mb-3" controlId="formBasicUserName">
                <Form.Label>User Name</Form.Label>
                <Form.Control onChange={handleChange} value={formData.userName} className='form_input' name='userName' type="text" placeholder="User Name" />
              </Form.Group> : ""
            }
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control onChange={handleChange} autoComplete="off" value={formData.email} className='form_input' type="email" name='email' placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control onChange={handleChange} autoComplete="off" value={formData.password} className='form_input' type="password" name='password' placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <Button className='button_login' type="submit">
                {loginForm ? 'Login' : 'SignUp'}
              </Button>
            </div>

          </Form>
          <div style={{ marginTop: "20px" }}>
            {
              loginForm ? <p>don't have an account?  <span onClick={() => setLoginForm(false)} style={{ color: "blue" }}>SignUp</span> </p> :
                <p>Already have an account? <span onClick={() => setLoginForm(true)} style={{ color: "blue" }}>Login</span> </p>
            }

          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginComponent