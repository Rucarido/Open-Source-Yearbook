import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Yearbook from './pages/Yearbook';
import ProtectedRoute from './components/ProtectedRoute';
import StarryBackground from './components/StarryBackground';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <StarryBackground>
            <Login />
          </StarryBackground>
        } />
        <Route path="/yearbook" element={<ProtectedRoute><Yearbook /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
