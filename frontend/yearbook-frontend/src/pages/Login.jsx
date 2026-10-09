import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import logo from '../assets/logo.jpg';
import { apiUrl } from '../api';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleAuthSubmit = async (formData) => {
    const endpoint = isRegister ? '/register' : '/login';
    setSuccessMessage('');
    const headers = isRegister
      ? { 'Content-Type': 'application/json' }  // JSON for register
      : { 'Content-Type': 'application/x-www-form-urlencoded' };  // Form for login

    try {
      const response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers,
        body: isRegister ? JSON.stringify(formData) : new URLSearchParams(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(formatError(data.detail));
      }

      if (endpoint === '/login') {
        localStorage.setItem('token', data.access_token);
        navigate('/yearbook');
      } else {
        setIsRegister(false);
        setSuccessMessage('Account created. Sign in to continue.');
      }
    } catch (err) {
      throw new Error(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl w-full max-w-md border border-white/20 relative">
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="w-auto h-24 rounded-lg shadow-2xl border border-white/20 mix-blend-screen object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
          {isRegister ? 'Register' : 'Login'} <span className="text-blue-300"> to Yearbook</span>
        </h2>
        <AuthForm onSubmit={handleAuthSubmit} isRegister={isRegister} />
        {successMessage && <p className="mt-4 text-center text-green-300 text-sm">{successMessage}</p>}
        <p className="text-center mt-4 text-gray-300">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setSuccessMessage('');
            }}
            className="text-blue-300 ml-1 hover:text-blue-100 font-semibold hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

const formatError = (detail) => {
  if (Array.isArray(detail)) return detail.map((error) => error.msg).join(', ');
  return detail || 'Something went wrong';
};

export default Login;
