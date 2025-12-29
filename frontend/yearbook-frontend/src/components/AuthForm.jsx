import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AuthForm = ({ onSubmit, isRegister = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formData = isRegister ? { email, password } : { username: email, password };
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Something went wrong');  // Use .message for string
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="Ex: example123@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-white/5 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Ex: 123456"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-white/5 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          required
        />
      </div>
      {error && <p className="text-red-300 text-sm bg-red-500/20 p-2 rounded text-center">{error}</p>}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold p-3 rounded-md hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg"
      >
        {isRegister ? 'Register' : 'Login'}
      </button>
    </form>
  );
};

AuthForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isRegister: PropTypes.bool,
};

export default AuthForm;