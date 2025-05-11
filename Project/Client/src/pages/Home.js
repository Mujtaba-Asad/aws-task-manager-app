// /client/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/auth.service';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Task Manager</h1>
        <p>Organize your tasks efficiently and boost your productivity</p>
        
        {isAuthenticated() ? (
          <Link to="/tasks" className="btn btn-primary">View My Tasks</Link>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>
        )}
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <h3>Task Organization</h3>
          <p>Create, organize, and prioritize your tasks efficiently</p>
        </div>
        
        <div className="feature-card">
          <h3>Image Uploads</h3>
          <p>Attach images to your tasks for better context</p>
        </div>
        
        <div className="feature-card">
          <h3>Secure Access</h3>
          <p>Your tasks are protected with secure authentication</p>
        </div>
      </div>
    </div>
  );
};

export default Home;