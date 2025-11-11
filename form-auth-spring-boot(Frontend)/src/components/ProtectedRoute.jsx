import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearToken } from '../store/authSlice'; 
import Dashboard from './Dashboard';
import axios from 'axios'; 

export default function ProtectedRoute() {
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        await axios.get('http://localhost:8080/api/auth/validate', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsValid(true);
      } catch (err) {
        dispatch(clearToken());
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };
    validateToken();
  }, [token, dispatch]);

  if (isLoading) {
    return <div className="text-white text-center p-5">Validating...</div>;
  }
  return isValid ? <Dashboard /> : <Navigate to="/login" state={{ from: location }} replace />;
}