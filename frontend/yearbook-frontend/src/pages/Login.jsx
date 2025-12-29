import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import logo from '../assets/logo.jpg';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleAuthSubmit = async (formData) => {
    const endpoint = isRegister ? '/register' : '/login';
    const headers = isRegister
      ? { 'Content-Type': 'application/json' }  // JSON for register
      : { 'Content-Type': 'application/x-www-form-urlencoded' };  // Form for login

    try {
      const response = await axios.post(`http://localhost:8000${endpoint}`, formData, { headers });

      // For login/register response handling
      if (endpoint === '/login') {
        localStorage.setItem('token', response.data.access_token);
      }
      // For register, no token needed yet (user can login after)

      navigate('/yearbook');
    } catch (err) {
      // Handle error display: Stringify if it's an array/object for safe rendering
      let errorMsg = 'Something went wrong';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          // Common for validation: Join messages
          errorMsg = err.response.data.detail.map(e => e.msg).join(', ');
        } else {
          errorMsg = err.response.data.detail;
        }
      }
      throw new Error(errorMsg);  // Re-throw for AuthForm to catch
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
        <p className="text-center mt-4 text-gray-300">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-300 ml-1 hover:text-blue-100 font-semibold hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;