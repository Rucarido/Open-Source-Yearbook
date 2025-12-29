import React from 'react';

const Background3D = ({ children }) => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#050510] text-white selection:bg-purple-500/30">
            <style>{`
            .perspective-container {
                perspective: 1000px;
                transform-style: preserve-3d;
            }
            
            .grid-floor {
                position: absolute;
                width: 200%;
                height: 200%;
                top: -50%;
                left: -50%;
                background-image: 
                    linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
                background-size: 50px 50px;
                transform: rotateX(60deg) translateZ(-200px);
                animation: grid-move 20s linear infinite;
                mask-image: linear-gradient(to bottom, transparent 0%, black 40%, black 80%, transparent 100%);
            }

            @keyframes grid-move {
                0% { transform: rotateX(60deg) translateZ(-200px) translateY(0); }
                100% { transform: rotateX(60deg) translateZ(-200px) translateY(50px); }
            }

            .orb {
                position: absolute;
                border-radius: 50%;
                filter: blur(80px);
                z-index: 0;
                animation: float-orb 20s infinite ease-in-out alternate;
            }

            @keyframes float-orb {
                0% { transform: translate(0, 0); }
                100% { transform: translate(30px, 50px); }
            }
        `}</style>

            {/* 3D Grid Floor */}
            <div className="fixed inset-0 perspective-container pointer-events-none z-0">
                <div className="grid-floor"></div>
            </div>

            {/* Ambient Orbs */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 orb" style={{ animationDuration: '25s' }} />
            <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 orb" style={{ animationDuration: '30s', animationDelay: '-5s' }} />
            <div className="fixed top-[40%] left-[60%] w-[300px] h-[300px] bg-pink-600/10 orb" style={{ animationDuration: '35s', animationDelay: '-10s' }} />

            {/* Vignette & Scanlines (Subtle) */}
            <div className="fixed inset-0 bg-gradient-to-t from-[#050510] via-transparent to-[#050510]/80 pointer-events-none z-0" />

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};

export default Background3D;
