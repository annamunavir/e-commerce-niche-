import React, { useContext, useState } from 'react'
import { productContext } from '../../context/ProductContext'
import ProductCard from '../../components/productCard/ProductCard'

const ShortList = () => {
   const{shortList}=useContext(productContext)
  if (!shortList) {
  console.warn("Product is undefined in ProductCard");
  return null;
}
 
  return (
    <div style={{width:"100vw",padding:"10px 50px"}} className='row'>
     {
      shortList.map((product,index)=>(
        <div  className='col-12 col-sm-12 col-md-4 col-lg-3 mb-2'  key={index}>
        <ProductCard product={product}/>
        </div>
      ))
     } 
    </div>
  )
}

export default ShortList