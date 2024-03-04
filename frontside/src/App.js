import PrivateRoute from './Privateroute'; // Import the PrivateRoute component
import Firstpage from "./Firstpage"
import Navbar from "./Navbar"
import Home from './Home'
import { Postproduct } from './Postproduct';
import React, { useState } from "react";
import swal from 'sweetalert';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import Logout from "./Logout";
import Specificproductdetails from "./Specificproductdetails"
import { Buyhistory } from './Buyhistory';
import { Sellhistory } from './Sellhistory';
import Totalrequests from './Totalrequests';
import { Buystatus } from './Buystatus';
import { Sellstatus } from './Sellstatus';
import { Bestseller } from './Bestseller';
import Bidproduct from './Bidproduct';



function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Firstpage />} />
        <Route path="/products" element={<Home />} />
        <Route path='/product' element={<Postproduct />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/bidproduct' element={<Bidproduct />} />
        <Route path='/buyhistory' element={<Buyhistory />} />
        <Route path='/sellhistory' element={<Sellhistory />} />
        <Route path='/totalrequests' element={<Totalrequests />} />
        <Route path='/buystatus' element={<Buystatus />} />
        <Route path='/bestseller' element={<Bestseller />} />
        <Route path='/sellstatus' element={<Sellstatus />} />
      </Routes>
    </Router>
  );
}

export default App;
