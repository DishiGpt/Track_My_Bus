
import React, { useState } from 'react';
import { UserRole } from './types';
import { Auth } from './components/Auth';
import { StudentView } from './components/StudentView';
import { DriverView } from './components/DriverView';
import { CoordinatorView } from './components/CoordinatorView';
import { AdminView } from './components/AdminView';

const App: React.FC = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);

  const handleLogin = (role: UserRole) => {
    setCurrentUserRole(role);
  };

  const handleLogout = () => {
    setCurrentUserRole(null);
  };

  if (!currentUserRole) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden md:max-w-full">
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-x-hidden md:max-w-full">
      {currentUserRole === UserRole.STUDENT && <StudentView onLogout={handleLogout} />}
      {currentUserRole === UserRole.DRIVER && <DriverView onLogout={handleLogout} />}
      {currentUserRole === UserRole.COORDINATOR && <CoordinatorView onLogout={handleLogout} />}
      {currentUserRole === UserRole.ADMIN && <AdminView onLogout={handleLogout} />}
    </div>
  );
};

export default App;
