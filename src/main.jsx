import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* Wrap your App here in Router */}
      <App />
    </Router>
  </React.StrictMode>,
)
