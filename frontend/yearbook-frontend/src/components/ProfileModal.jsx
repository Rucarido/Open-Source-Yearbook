import React from 'react';

const ProfileModal = ({ profile, onClose }) => {
    if (!profile) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-4xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[800px]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 text-white/50 hover:text-white bg-black/50 rounded-full p-2 backdrop-blur-md"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                    {profile.photo_url ? (
                        <img
                            src={profile.photo_url}
                            alt={profile.full_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <span className="text-6xl text-gray-700">?</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                    <div className="mb-6">
                        <h2 className="text-4xl font-bold text-white mb-2">{profile.full_name}</h2>
                        <p className="text-purple-400 text-lg font-medium">Class of {profile.batch_year}</p>
                    </div>

                    {profile.quote && (
                        <div className="mb-8 relative">
                            <span className="absolute -top-4 -left-2 text-6xl text-white/10 font-serif">"</span>
                            <p className="text-2xl text-gray-200 italic font-light relative z-10 leading-relaxed">
                                {profile.quote}
                            </p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2">Bio</h4>
                            <p className="text-gray-300 leading-relaxed">
                                {profile.bio || "No bio yet."}
                            </p>
                        </div>

                        {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Connect</h4>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(profile.social_links).map(([platform, url]) => (
                                        url && (
                                            <a
                                                key={platform}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors capitalize"
                                            >
                                                {platform}
                                            </a>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
