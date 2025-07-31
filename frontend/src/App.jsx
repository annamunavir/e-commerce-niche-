import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Products from './pages/products/Products'
import SingleProduct from './pages/singleProduct/SingleProduct'
import Cart from './pages/Cart/Cart'
import SubHeader from './components/subHeader/SubHeader'
import Contact from './pages/contact/Contact'
import LoginComponent from './components/login/LoginComponent'
import { useContext } from 'react'
import  {productContext}  from './context/ProductContext'
import ShortList from './pages/shortList/ShortList'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlaceOrder from './pages/placeOrder/PlaceOrder'
import Profile from './pages/profile/Profile'
import Orders from './pages/oders/Orders'

function App() {
const {nav,subNav}=useContext(productContext)
  return (
    <div>
    <ToastContainer position="top-center" autoClose={2000} />

      {nav?<Header />:""}
      {subNav?<SubHeader />:""}
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishList" element={<ShortList/>} />
        <Route path="/placeOrder" element={<PlaceOrder/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path='/orders'  element={<Orders/>}/>




      </Routes>
      <Footer />
    
    </div>

  )
}

export default App
