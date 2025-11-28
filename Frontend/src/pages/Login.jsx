import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ProfileCarousel from '../components/auth/ProfileCarousel';
import LoadingScreen from '../components/LoadingScreen';

const API_URL = "http://localhost:4000/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerRole, setRegisterRole] = useState('student');
  const [showLoading, setShowLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const parsedUser = JSON.parse(user);

      if (parsedUser.role === "mentor") {
        navigate("/mentor/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }

    // If came from "Register as Mentor/Student"
    if (location.pathname === "/register" && location.state?.role) {
      setIsRegistering(true);
      setRegisterRole(location.state.role);
    }
  }, [navigate, location]);

  // --------------------------
  // SIMPLE LOGIN FETCH HANDLER
  // --------------------------
  const handleLogin = async (formData) => {
    try {
      setError('');
      setShowLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setShowLoading(false);
        throw new Error(data.message || "Login failed");
      }

      // Save user + token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      // Keep loading screen for 2 seconds then redirect
      setTimeout(() => {
        if (data.role === "mentor") {
          navigate("/mentor/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }, 2000);

    } catch (err) {
      setShowLoading(false);
      setError(err.message);
    }
  };

  // ------------------------------
  // REGISTER AND AUTO-LOGIN HANDLER
  // ------------------------------
  const handleRegister = async (formData) => {
    try {
      setError('');
      setShowLoading(true);

      // 1. First, register the user
      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: registerRole
        })
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        setShowLoading(false);
        throw new Error(registerData.message || "Registration failed");
      }

      // 2. If registration is successful, log the user in
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setShowLoading(false);
        throw new Error(loginData.message || "Auto-login after registration failed");
      }

      // Save the token and user data from login response
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("user", JSON.stringify(loginData));

      // Keep loading screen for 2 seconds then redirect
      setTimeout(() => {
        if (registerRole === "mentor") {
          navigate("/mentor/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }, 2000);

    } catch (err) {
      setShowLoading(false);
      setError(err.message);
    }
  };

  const handleNavigateToRegister = (role) => {
    setIsRegistering(true);
    setRegisterRole(role);
    window.history.pushState({}, "", "/register");
  };

  const handleSwitchToLogin = () => {
    setIsRegistering(false);
    window.history.pushState({}, "", "/login");
  };

  // Show loading screen only when logging in
  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {isRegistering ? (
            <RegisterForm
              onSubmit={handleRegister}
              onSwitchToLogin={handleSwitchToLogin}
              role={registerRole}
            />
          ) : (
            <LoginForm
              onSubmit={handleLogin}
              onNavigateToRegister={handleNavigateToRegister}
            />
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Profile Carousel */}
      <div className="hidden lg:block lg:w-1/2 h-screen">
        <ProfileCarousel />
      </div>
    </div>
  );
};

export default Login;
