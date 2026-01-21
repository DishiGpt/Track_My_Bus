import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Track My Bus</h1>
        <p className="text-gray-100 mb-8 text-lg">
          Real-time bus tracking for students, drivers, and coordinators
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-white text-blue-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Sign Up as Student
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-800 text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
