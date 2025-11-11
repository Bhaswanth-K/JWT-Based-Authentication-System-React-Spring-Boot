import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading, setError } from '../store/authSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const API_BASE = 'http://localhost:8080/api/auth';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '', password: '', email: '', phone: ''
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.auth);

  const usernameRegex = /^[a-zA-Z0-9_-]{3,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  const emailRegex = /^\S+@\S+\.\S+$/;
  const phoneRegex = /^\d{10}$/;

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'username':
        if (!value) error = 'Username is required.';
        else if (!usernameRegex.test(value)) error = 'Username must be at least 3 characters long and no spaces.';
        break;
      case 'password':
        if (!value) error = 'Password is required.';
        else if (!passwordRegex.test(value)) error = 'Password must be at least 8 characters with 1 uppercase and 1 number.';
        break;
      case 'email':
        if (!value) error = 'Email is required.';
        else if (!emailRegex.test(value)) error = 'Please enter a valid email address.';
        break;
      case 'phone':
        if (!value) error = 'Phone number is required.';
        else if (!phoneRegex.test(value)) error = 'Phone number must be exactly 10 digits.';
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every(error => !error);
    return { isValid, newErrors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid } = validateForm();
    if (isValid) {
      dispatch(setLoading(true));
      try {
        await axios.post(`${API_BASE}/register`, formData);
        toast.success('Registration successful!');
        setFormData({ username: '', password: '', email: '', phone: '' });
        setErrors({});
        navigate('/login');
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Registration failed';
        dispatch(setError(errorMsg));
        toast.error(errorMsg);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-md-6 col-12"
    >
      <div className="card shadow">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Register Form</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.username && <div className="invalid-feedback d-block">{errors.username}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-primary w-100 mt-3">
              {isLoading ? (
                <>
                  <ClipLoader color="#FFD700" size={20} className="spinner" />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>
          <p className="text-center mt-3">
            <Link to="/login" className="text-light">Already have an account? Login</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}