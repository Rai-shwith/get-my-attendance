import React from 'react'
import { Link } from 'react-router-dom'
const NavBar = () => {
  return (
    <ul className='flex space-x-2 justify-start bg-slate-500 p-4'>
        <li><Link to="/">Main</Link></li>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/about">about</Link></li>
    </ul>
  );
};

export default NavBar