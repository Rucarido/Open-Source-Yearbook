import React, { useState } from "react";
import { Book, LogOut, Users, Star } from "lucide-react";
import ClubImage from "../assets/logo.png"; 

const Yearbook = () => {
  const [students] = useState([
    { name: "Alex Johnson", major: "Computer Science", image: "AJ" },
    { name: "Brenda Smith", major: "Graphic Design", image: "BS" },
    { name: "Charles Davis", major: "Business Administration", image: "CD" },
    { name: "Diana Miller", major: "Biology", image: "DM" },
    { name: "Ethan Wilson", major: "Engineering", image: "EW" },
    { name: "Fiona Garcia", major: "Mathematics", image: "FG" },
    { name: "George Rodriguez", major: "Physics", image: "GR" },
    { name: "Hannah Martinez", major: "Chemistry", image: "HM" }
  ]);

  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-black via-[#070b16] to-black text-white">
      
      {/* Soft radial glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-600/20 blur-[200px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-purple-500/30 shadow-lg shadow-purple-500/10">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              OpenYearbook
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center max-w-7xl mx-auto mb-16">
          
          {/* LEFT CLUB IMAGE PANEL */}
          <div className="flex justify-center">
            <div className="relative w-80 h-96 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden 
              border border-purple-500/40 bg-gradient-to-b from-purple-700/20 to-blue-500/10">

              {/* Vertical hologram lines */}
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute h-full w-px left-1/3 bg-gradient-to-b from-transparent via-purple-400/40 to-transparent"></div>
                <div className="absolute h-full w-px left-2/3 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent"></div>
              </div>

              {/* Club Image */}
              <img
                src={ClubImage}
                alt="Club"
                className="absolute inset-0 w-full h-full object-cover opacity-90 rounded-3xl"
              />

              {/* Bottom glow rings */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-px bg-purple-300/40 rounded-full"></div>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-px bg-purple-300/30 rounded-full"></div>
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-36 h-px bg-purple-300/20 rounded-full"></div>
            </div>
          </div>

          {/* RIGHT HERO TEXT */}
          <div>
            <h2 className="text-6xl font-bold leading-tight mb-6">
              <span className="text-purple-400">Beyond</span>{" "}
              <span className="text-pink-500">Imagination</span>
            </h2>

            <p className="text-gray-300 text-lg max-w-lg leading-relaxed mb-8">
              Step into a futuristic yearbook — a digital space where memories,
              faces, and stories are preserved with style. This layout is your
              canvas. Add profiles, galleries, and batch highlights here.
            </p>

            <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 transition">
              <Users className="w-5 h-5" />
              Explore Students
            </button>
          </div>
        </div>

        {/* STUDENT GRID */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-8 h-8 text-purple-400" />
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Class of 2025
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {students.map((student, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl backdrop-blur-xl 
                bg-gradient-to-b from-purple-900/20 to-blue-900/10 border border-purple-500/30 
                hover:border-purple-400/60 transition-all duration-300 hover:scale-105 
                hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="relative p-6 text-center">

                  {/* Avatar */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full 
                    bg-gradient-to-br from-purple-500 to-pink-500 
                    flex items-center justify-center text-2xl font-bold shadow-lg">
                    {student.image}
                  </div>

                  {/* Name */}
                  <h4 className="text-xl font-semibold mb-2">
                    {student.name}
                  </h4>

                  {/* Major */}
                  <p className="text-purple-300 text-sm">
                    {student.major}
                  </p>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Yearbook;
