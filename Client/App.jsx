import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { Auth } from './components/Auth';
import { StudentView } from './components/StudentView';
import { DriverView } from './components/DriverView';
import { CoordinatorView } from './components/CoordinatorView';
import { AdminView } from './components/AdminView';
import api from './src/api/axios';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
      // Decode or verify token to get user role/id if possible, or fetch /me
      // For now, let's assume if token exists we might need to re-fetch user profile
      // But we don't have a generic /me endpoint for all roles easily unless we parse token or try one.
      // Let's implement a simple restoration if you wish, or just require login.
      // Simplification: clear token on hard refresh if we can't validate, or just stay logged out.
      // For better UX, let's just show Auth. If user logs in again, they get new token.
      // Or:
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Persist if needed or rely on token + fetch
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden md:max-w-full">
        <Auth onLogin={handleLogin} />
      </div>
    );
  };

  // Views now fetch their own data. passing currentUser is useful.
  const props = { onLogout: handleLogout, currentUser };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-x-hidden md:max-w-full">
      {currentUser.role === UserRole.STUDENT && <StudentView {...props} />}
      {currentUser.role === UserRole.DRIVER && <DriverView {...props} />}
      {currentUser.role === UserRole.COORDINATOR && <CoordinatorView {...props} />}
      {currentUser.role === UserRole.ADMIN && <AdminView {...props} />}
    </div>
  );
};

export default App;
