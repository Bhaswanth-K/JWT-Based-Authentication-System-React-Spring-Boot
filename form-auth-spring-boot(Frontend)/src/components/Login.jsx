import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setLoading, setError } from '../store/authSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const API_BASE = 'http://localhost:8080/api/auth';

export default function Login() {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await axios.post(`${API_BASE}/login`, loginData);
      const { token } = response.data;
      dispatch(setToken(token));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      dispatch(setError(errorMsg));
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      dispatch(setLoading(false));
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
          <h2 className="text-center mb-4">Login Form</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                id="username"
                name="username"
                value={loginData.username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-primary w-100 mt-3">
              {isLoading ? (
                <>
                  <ClipLoader color="#FFD700" size={20} className="spinner" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
          <p className="text-center mt-3">
            <Link to="/" className="text-light">Don't have an account? Register</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}