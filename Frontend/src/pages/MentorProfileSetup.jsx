import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorNavbar from '../components/MentorDashboard/Navbar';
import MentorProfileForm from '../components/MentorDashboard/MentorProfileForm';

const MentorProfileSetup = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileComplete = async (formData) => {
    setIsSubmitting(true);
    try {
      // TODO: Connect to your API endpoint
      // const response = await fetch('/api/mentor/profile', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();
      
      // For now, just log and navigate
      console.log('Profile data to be saved:', formData);
      navigate('/mentor/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MentorNavbar />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <MentorProfileForm onComplete={handleProfileComplete} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default MentorProfileSetup;
