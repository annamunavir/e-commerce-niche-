import React, { useEffect } from 'react'
import './dashboard.css'

const Dashboard = ({setNav}) => {
  
useEffect(()=>{setNav(true),[setNav]})


  return (
    <div className='dashboard'>Dashboard</div>
  )
}

export default Dashboard