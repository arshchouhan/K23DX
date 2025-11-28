import React, { useState } from 'react';

const RegisterForm = ({ onSubmit, onSwitchToLogin, role }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onSubmit({ ...formData, role });
  };

  return (
    <div className="w-full max-w-md mx-auto pt-10">
      <h1 className="text-4xl font-semibold text-gray-900 text-center mb-8">
        Join as a {role}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm text-gray-700">Full Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mt-1"
          />
        </div>


        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Sign up as {role}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <button 
            type="button"
            onClick={onSwitchToLogin}
            className="text-green-600 font-medium hover:underline focus:outline-none"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
