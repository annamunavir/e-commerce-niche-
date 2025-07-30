import { Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import Login from './components/login/Login';
import AddProduct from './pages/addProduct/AddProduct';
import EditProduct from './pages/editProduct/EditProduct';
import ListProducts from './pages/listProduct/ListProducts';
import Orders from './pages/orders/Orders';
import Dashboard from './pages/dashboard/Dashboard';
import { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import OfferProduct from './pages/offerproduct/OfferProduct';
import AddCategory from './pages/category/AddCategory';
import Categories from './pages/categories/Categories';
import EditCategory from './pages/editCategories/EditCategories';

function App() {
  const [nav, setNav] = useState(true);

  // 👇 using context instead of props
  const {
    token,
    showLoginPopup,
    setShowLoginPopup,
    showLoginForm,
    setShowLoginForm,
    setToken,
  } = useContext(AuthContext);

  return (
    <div>
      {nav && <Header />}
      <div className='app_container'>
        <Sidebar />

        {/* 👇 Only show login popup if requested */}
        {showLoginPopup && (
          <Login />
        )}

        <Routes>
          <Route path='/add' element={<AddProduct setNav={setNav} />} />
          <Route path='/updateProduct/:id' element={<EditProduct setNav={setNav} />} />
          <Route path='/products' element={<ListProducts setNav={setNav} />} />
          <Route path='/orders' element={<Orders setNav={setNav} />} />
          <Route path='/' element={<Dashboard setNav={setNav} />} />
          <Route path='/offers' element={<OfferProduct setNav={setNav} />} />
          <Route path='/addCategories' element={<AddCategory setNav={setNav} />} />
          <Route path='/categories' element={<Categories setNav={setNav} />} />
          <Route path='//updateCategory/:id' element={<EditCategory setNav={setNav} />} /> 



        </Routes>
      </div>
    </div>
  );
}

export default App;
