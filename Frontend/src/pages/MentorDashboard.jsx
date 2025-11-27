import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorNavbar from '../components/MentorDashboard/Navbar';

const MentorDashboard = () => {
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

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    // Redirect if not a mentor
    if (user && user.role !== 'mentor') {
      navigate("/student/dashboard");
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
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <MentorNavbar userName={profile?.name || 'Mentor'} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, Mentor!</h1>
        
        {loading && <p className="text-gray-600">Loading your profile...</p>}
        
        {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg">Error: {error}</p>}

        {profile ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Mentor Profile</h2>
            <div className="space-y-3">
              <p className="text-gray-700"><span className="font-medium">Name:</span> {profile.name}</p>
              <p className="text-gray-700"><span className="font-medium">Email:</span> {profile.email}</p>
              <p className="text-gray-700"><span className="font-medium">Role:</span> {profile.role}</p>
            </div>
          </div>
        ) : (
          !loading && !error && <p className="text-gray-600">No profile found</p>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
