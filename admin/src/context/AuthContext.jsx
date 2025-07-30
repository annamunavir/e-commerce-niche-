import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('admintoken') || '');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true); // true: Login, false: Signup

  useEffect(() => {
    if (token) {
      localStorage.setItem('admintoken', token);
    } else {
      localStorage.removeItem('admintoken');
    }
  }, [token]);


  const value = {
    token,
    setToken,
    showLoginPopup,
    setShowLoginPopup,
    showLoginForm,
    setShowLoginForm
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>


  )
}

export default AuthProvider