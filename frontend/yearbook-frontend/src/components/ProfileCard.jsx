import React from 'react';

const ProfileCard = ({ profile, onClick }) => {
    return (
        <div
            onClick={() => onClick(profile)}
            className="relative group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/20"
        >
            <div className="aspect-[3/4] overflow-hidden">
                {profile.photo_url ? (
                    <img
                        src={profile.photo_url}
                        alt={profile.full_name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-4xl text-gray-600">?</span>
                    </div>
                )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

            <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                <h3 className="text-xl font-bold text-white mb-1">{profile.full_name}</h3>
                <p className="text-purple-300 text-sm font-medium mb-2">Class of {profile.batch_year}</p>
                {profile.quote && (
                    <p className="text-gray-300 text-xs italic line-clamp-2">"{profile.quote}"</p>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
