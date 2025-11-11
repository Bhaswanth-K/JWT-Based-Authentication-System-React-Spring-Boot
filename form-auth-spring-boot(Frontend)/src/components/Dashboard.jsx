import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { clearToken } from '../store/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearToken());
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="col-md-6 col-12"
    >
      <div className="card shadow">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Welcome to Dashboard!</h2>
          <div className="mb-3 text-white">
            <strong>Status:</strong> Logged in (Token Active)
          </div>
          <button onClick={handleLogout} className="btn btn-danger w-100 mt-3">Logout</button>
        </div>
      </div>
    </motion.div>
  );
}