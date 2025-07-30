import { StrictMode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import ProductContext from './context/ProductContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
   <ProductContext>
    <App />
    </ProductContext>
    </BrowserRouter>
    
    
    
  </StrictMode>,
)
