import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Yearbook from './pages/Yearbook';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/yearbook" element={<ProtectedRoute><Yearbook /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;