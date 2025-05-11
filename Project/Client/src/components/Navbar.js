// /client/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth.service';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Task Manager</Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/tasks" className="navbar-item">My Tasks</Link>
            <Link to="/tasks/new" className="navbar-item">Create Task</Link>
            <div className="navbar-item user-info">
              <span>Welcome, {user.username}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/register" className="navbar-item">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;