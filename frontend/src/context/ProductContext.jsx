import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const productContext = createContext();

const ProductContext = ({ children }) => {
  const navigate = useNavigate();
  const [nav, setNav] = useState(true);
  const [subNav, setSubNav] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [allProducts, setAllProducts] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [searchProducts, setSearchProducts] = useState([])
  const [shortList, setShortList] = useState([])
  const [cart,setCart]=useState([])
  const url = "https://e-commerce-niche-backend.onrender.com/api";
  const user_url = "https://e-commerce-niche-backend.onrender.com"
 const [user,setUser]=useState(null)



  const fetchUserProfile = async () => {
  const res = await axios.get(`${user_url}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  setUser(res.data);
};

//category
 
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${url}/categories`);
        setCategoriesData(res.data); // Example: { category: 'Toys', subcategories: ['Cars', 'Blocks'] }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

 

  // handleSearch

  const handleSearch = async (e) => {
    const value = e.target.value.trim();
    setSearchTerm(value);
    if (!value) {
      setSearchProducts([]);
      return;
    }
    try {
      const response = await axios.get(`${url}/products/search?query=${encodeURIComponent(value)}`);

      if (Array.isArray(response.data)) {
        setSearchProducts(response.data);
      } else {
        setSearchProducts([]);
      }
    } catch (error) {
      console.error("❌ Search API error:", error);
      setSearchProducts([]);
    }
  };


  // 🔁 Fetch All products

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${url}/products`);
      setAllProducts(response.data || []);
      // console.log('Fetched products:', response.data); // ✅ correct!
    } catch (error) {
      console.error('❌ Error fetching products:', error.message);
    }
  };

  //fetch shortlist

  const fetchShortlist = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${user_url}/shortlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ Save full product objects
      setShortList(res.data); // full product objects
    } catch (err) {
      console.error('❌ Failed to fetch shortlist:', err);
    }
  };;


 const fetchCart = async () => {
  try {
    const res = await axios.get(`${user_url}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Optional: log the response to verify it's populated correctly
    // console.log("✅ Cart fetched:", res.data);

    setCart(res.data); // res.data should be an array of { product: { full product data } }
  } catch (error) {
    console.error("❌ Failed to fetch cart:", error);
  }
};


useEffect(() => {

    fetchAllProducts();
    fetchUserProfile()
    fetchCategories();

  }, []);


  // 🧠 Sync token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchShortlist();
      fetchCart()
    } else {
      localStorage.removeItem('token');
      setShortList([]);
    }
  }, [token]);

  const value = {
    nav,
    setNav,
    subNav,
    setSubNav,
    token,
    setToken,
    navigate,
    allProducts,
    setAllProducts,
    fetchAllProducts,
    category,
    setCategory,
    subCategory,
    setSubCategory,
    categoriesData,
    setCategoriesData,
    setSearchTerm,
    searchTerm,
    handleSearch,
    searchProducts,
    setSearchProducts,
    shortList,
    setShortList,
    user_url,
    url,
    fetchShortlist,
    cart,
    setCart,
    fetchCart,
    user,
    fetchCategories
  };

  return (
    <productContext.Provider value={value}>
      {children}
    </productContext.Provider>
  );
};

export default ProductContext;
