import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/navbar';
import Home from './pages/home';
import Footer from './components/footer';
import ContactUs from './pages/contactus';
import Login from './pages/login';
import AuctionPage from './pages/EnchereDetails';
import NavBarAdmin from './components/navbarAdmin';
import BakendHome from './pages/admin/HomeAdmin';
import AddEnchere from './pages/admin/AddEnchere';
import Register from './pages/registre';
import UserProfile from './pages/UserProfil';
import EditEnchere from './pages/admin/EditEnchere';
import UsersPage from './pages/admin/UsersBackend';
import AuctionList from './pages/EnchereListe';
import UsersPageBackend from './pages/admin/UsersPage';

function App() {
  const [role, setRole] = useState<string | null>(null); 

  useEffect(() => {
    const userRole = localStorage.getItem("userRole") || "user";
    setRole(userRole); 
  }, []);

  return (
    <Router>
      {role === "admin" ? 
      
        <NavBarAdmin /> : 
        
        <NavBar />
      
      }
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact_us" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auctionview/:id" element={<AuctionPage />} />
        <Route path="/auction" element={<AuctionList />} />
        <Route path="/Backend" element={<BakendHome />} />
        <Route path="/AddEnchere" element={<AddEnchere />} />
        <Route path="/Admin/Users" element={<UsersPageBackend />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/EditEnchere/:id" element={<EditEnchere />} />

    
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
