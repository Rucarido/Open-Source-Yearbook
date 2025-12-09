import React from 'react';
import { useNavigate } from 'react-router-dom';

const Yearbook = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="p-8 bg-black h-screen w-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Yearbook</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <p className="text-lg text-white">This is the main yearbook page. Add your photos, memories, and features here!</p>
      {/* Future: Grid for yearbook entries */}
    </div>
  );
};

export default Yearbook;