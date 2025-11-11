import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ToastWrapper from './components/ToastWrapper';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-vh-100 d-flex align-items-center justify-content-center p-3 bg-dark text-white">
        <div className="container">
          <div className="row justify-content-center">
            <Routes>
              <Route path="/" element={<RegistrationForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute />} />
              <Route path="*" element={<RegistrationForm />} />
            </Routes>
          </div>
          <ToastWrapper />
        </div>
      </div>
    </Router>
  );
}

export default App;