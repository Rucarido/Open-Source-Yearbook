import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import ProfileModal from '../components/ProfileModal';
import EditProfileForm from '../components/EditProfileForm';
import Background3D from '../components/Background3D';

const Yearbook = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Multi-profile state
  const [myProfiles, setMyProfiles] = useState([]);
  const [showMyProfilesModal, setShowMyProfilesModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const fetchProfiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/yearbook');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data);
      }
    } catch (error) {
      console.error('Error fetching yearbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProfiles = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMyProfiles(data);
      }
    } catch (error) {
      console.error("Error fetching my profiles", error);
    }
  }

  useEffect(() => {
    fetchProfiles();
    fetchMyProfiles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfileUpdate = () => {
    fetchProfiles();
    fetchMyProfiles();
  }

  const openCreateProfile = () => {
    setEditingProfile(null);
    setIsEditing(true);
    setShowMyProfilesModal(false);
  };

  const openEditProfile = (profile) => {
    setEditingProfile(profile);
    setIsEditing(true);
    setShowMyProfilesModal(false);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Background3D>
      {/* Nav - Floating Island */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl flex justify-between items-center px-8 py-4 z-50 bg-[#050510]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-purple-500/5 transition-all">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider cursor-pointer select-none" onClick={handleHomeClick}>
          YEARBOOK <span className='text-pink-500'>2025</span>
        </h1>
        <div className="flex gap-6 md:gap-8 text-gray-300 items-center text-sm md:text-base font-medium">
          <a href="#" onClick={handleHomeClick} className="hover:text-white transition-colors">Home</a>
          <a href="#years" className="hover:text-white transition-colors">Explore</a>

          {isLoggedIn ? (
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setShowMyProfilesModal(true)}
                className="hover:text-white transition-colors text-pink-500 hover:text-pink-400 font-semibold"
              >
                My Profiles
              </button>
              <button onClick={handleLogout} className="hover:text-white transition-colors">Logout</button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Login</button>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-6 md:px-16 pt-32 pb-12 relative z-10">

        {/* Hero Section */}
        <section className="grid md:grid-cols-2 items-center py-12 md:py-24 gap-12 min-h-[60vh]">
          <div className='order-2 md:order-1'>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white/90">
              Beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Memories</span>
            </h1>
            <p className="mt-6 text-gray-400 max-w-lg text-lg leading-relaxed">
              A futuristic digital yearbook preserving your college journey forever, just... for your remembrance.
            </p>
            <a href="#years"
              className="inline-block mt-10 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Start Exploring
            </a>
          </div>

          <div className="order-1 md:order-2 flex justify-center items-center h-[400px]">
            {/* CSS 3D Animation Component */}
            <div className="relative w-64 h-64 perspective-1000">
              <style>{`
                    .perspective-1000 { perspective: 1000px; }
                    .cube-container {
                        width: 100%;
                        height: 100%;
                        position: relative;
                        transform-style: preserve-3d;
                        animation: float-rotate 12s infinite linear;
                    }
                    .cube-face {
                        position: absolute;
                        width: 200px;
                        height: 200px;
                        left: 28px; /* (256 - 200) / 2 */
                        top: 28px;
                        border: 2px solid rgba(236, 72, 153, 0.5);
                        background: rgba(139, 92, 246, 0.05);
                        backdrop-filter: blur(4px);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 32px;
                        font-weight: 800;
                        color: rgba(255, 255, 255, 0.9);
                        box-shadow: 0 0 40px rgba(139, 92, 246, 0.1) inset;
                        backface-visibility: visible;
                        text-shadow: 0 0 10px rgba(255,255,255,0.5);
                        user-select: none;
                    }
                    .face-front  { transform: rotateY(0deg) translateZ(100px); }
                    .face-back   { transform: rotateY(180deg) translateZ(100px); }
                    .face-right  { transform: rotateY(90deg) translateZ(100px); }
                    .face-left   { transform: rotateY(-90deg) translateZ(100px); }
                    .face-top    { transform: rotateX(90deg) translateZ(100px); }
                    .face-bottom { transform: rotateX(-90deg) translateZ(100px); }

                    @keyframes float-rotate {
                        0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
                        100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
                    }
                `}</style>
              <div className="cube-container">
                <div className="cube-face face-front">2025</div>
                <div className="cube-face face-back">YEAR</div>
                <div className="cube-face face-right">BOOK</div>
                <div className="cube-face face-left">MEMORIES</div>
                <div className="cube-face face-top">✨</div>
                <div className="cube-face face-bottom">🚀</div>
              </div>
              {/* Glowing Core */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-600/40 rounded-full blur-3xl animate-pulse -z-10"></div>
            </div>
          </div>
        </section>

        {/* Grid Section */}
        <section id="years" className="pt-12">
          <h2 className="text-4xl font-bold mb-10 text-white">Explore User Profiles</h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-gray-300 mb-4">The Yearbook is Empty!</h3>
              <p className="text-gray-400 mb-8">Be the first to leave your mark.</p>
              {isLoggedIn && (
                <button
                  onClick={openCreateProfile}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all text-white"
                >
                  Create Profile
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onClick={setSelectedProfile}
                />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Profile Details Modal */}
      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}

      {/* Edit/Create Form Modal */}
      {isEditing && (
        <EditProfileForm
          currentProfile={editingProfile}
          onClose={() => setIsEditing(false)}
          onSave={handleProfileUpdate}
        />
      )}

      {/* My Profiles Selection Modal */}
      {showMyProfilesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-gray-900 rounded-xl border border-white/10 shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">My Profiles</h2>
              <button onClick={() => setShowMyProfilesModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {myProfiles.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-pink-500/50 transition-colors">
                  <img src={p.photo_url || 'https://via.placeholder.com/50'} alt={p.full_name} className="w-12 h-12 rounded-full object-cover border border-white/20" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{p.full_name}</h4>
                    <p className="text-xs text-gray-400">Class of {p.batch_year}</p>
                  </div>
                  <button
                    onClick={() => openEditProfile(p)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm text-white transition-colors border border-white/10"
                  >
                    Edit
                  </button>
                </div>
              ))}

              {myProfiles.length === 0 && (
                <p className="text-gray-500 text-center py-4">You haven't created any profiles yet.</p>
              )}
            </div>

            <button
              onClick={openCreateProfile}
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              + Create New Profile
            </button>
          </div>
        </div>
      )}

    </Background3D>
  );
};

export default Yearbook;