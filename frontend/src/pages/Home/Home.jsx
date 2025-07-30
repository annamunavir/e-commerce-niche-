import React, { useContext, useEffect } from 'react'
import './home.css'
import Banner from '../../components/banner/Banner'
import Popular from '../../components/popular/Popular'
import Category from '../../components/category/Category'
import Latest from '../../components/latest/Latest'
import Contact from '../contact/Contact'
import About from '../../components/about/About'
import Testimonial from '../../components/testimonial/Testimonial'
import { productContext } from '../../context/ProductContext'

const Home = () => {
  const {setSubNav}=useContext(productContext)

  useEffect(()=>{setSubNav(true)},[])
  return (
    <div>
      <Banner/>
      <Popular/>
      <section id='category'><Category/></section>
      <Latest/>
      <Testimonial/>
      <section id='about'><About/></section>
      {/* <Contact/> */}
    </div>
  )
}

export default Home