import React, { useState, useEffect } from 'react';

const EditProfileForm = ({ currentProfile, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        batch_year: new Date().getFullYear(),
        quote: '',
        bio: '',
        photo_url: '',
        linkedin: '',
        github: '',
        x: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (currentProfile) {
            setFormData({
                full_name: currentProfile.full_name || '',
                batch_year: currentProfile.batch_year || new Date().getFullYear(),
                quote: currentProfile.quote || '',
                bio: currentProfile.bio || '',
                photo_url: currentProfile.photo_url || '',
                linkedin: currentProfile.social_links?.linkedin || '',
                github: currentProfile.social_links?.github || '',
                x: currentProfile.social_links?.x || ''
            });
        }
    }, [currentProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setFormData(prev => ({ ...prev, photo_url: data.url }));
        } catch (err) {
            setError('Image upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your profile? This cannot be undone.")) return;

        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const url = `http://localhost:8000/profile/${currentProfile.id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to delete");

            onSave(); // Refresh (will clear profile)
            onClose();
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');

        // Construct payload matching the backend schema
        const payload = {
            full_name: formData.full_name,
            batch_year: parseInt(formData.batch_year),
            quote: formData.quote,
            bio: formData.bio,
            photo_url: formData.photo_url,
            social_links: {
                linkedin: formData.linkedin,
                github: formData.github,
                x: formData.x
            }
        };

        try {
            const isUpdate = currentProfile && currentProfile.id;
            const url = isUpdate
                ? `http://localhost:8000/profile/${currentProfile.id}`
                : 'http://localhost:8000/profile';
            const method = isUpdate ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to save profile');
            }

            await response.json();
            onSave(); // Refresh parent
            onClose(); // Close modal
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-gray-900 rounded-xl border border-white/10 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Edit Your Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {error && <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Batch Year</label>
                            <input
                                type="number"
                                name="batch_year"
                                value={formData.batch_year}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Profile Photo</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-500/20 file:text-purple-300
                    hover:file:bg-purple-500/30"
                            />
                            {uploading && <span className="text-gray-400 self-center">Uploading...</span>}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">OR</span>
                            <input
                                type="url"
                                name="photo_url"
                                value={formData.photo_url}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        {formData.photo_url && (
                            <img src={formData.photo_url} alt="Preview" className="h-16 w-16 object-cover rounded-md mt-2 border border-white/20" />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Senior Quote</label>
                        <textarea
                            name="quote"
                            value={formData.quote}
                            onChange={handleChange}
                            rows="2"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-400">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                placeholder="LinkedIn URL"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                            <input
                                type="url"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="GitHub URL"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                            <input
                                type="url"
                                name="x"
                                value={formData.x}
                                onChange={handleChange}
                                placeholder="X URL"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between gap-3">
                        {currentProfile && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/20"
                            >
                                Delete Profile
                            </button>
                        )}
                        <div className="flex gap-3 ml-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileForm;
