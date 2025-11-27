import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/StudentDashboard/Navbar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        const res = await fetch("http://localhost:4000/api/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setProfile(data.user);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name || 'Student'} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
        
        {loading && <p className="text-gray-600">Loading your profile...</p>}
        
        {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg">Error: {error}</p>}

        {profile ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-lg font-semibold text-gray-800">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Role</p>
                <p className="text-lg font-semibold text-gray-800">{profile.role}</p>
              </div>
              {profile.bio && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Bio</p>
                  <p className="text-lg text-gray-800">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          !loading && <p className="text-gray-600">No profile found</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
