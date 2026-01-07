
import React, { useState, useEffect } from 'react';
import { UserRole, User, Bus, Driver } from './types';
import { INITIAL_USERS, INITIAL_BUSES, INITIAL_DRIVERS } from './mockData';
import { Auth } from './components/Auth';
import { StudentView } from './components/StudentView';
import { DriverView } from './components/DriverView';
import { CoordinatorView } from './components/CoordinatorView';
import { AdminView } from './components/AdminView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tmb_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [buses, setBuses] = useState<Bus[]>(() => {
    const saved = localStorage.getItem('tmb_buses');
    return saved ? JSON.parse(saved) : INITIAL_BUSES;
  });
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('tmb_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  useEffect(() => {
    localStorage.setItem('tmb_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tmb_buses', JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem('tmb_drivers', JSON.stringify(drivers));
  }, [drivers]);

  const handleLogin = (phone: string, name: string, pass: string) => {
    const user = users.find(u => u.phoneNumber === phone && u.password === pass && u.name.toLowerCase() === name.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleRegister = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden md:max-w-full">
        <Auth onLogin={handleLogin} onRegister={handleRegister} users={users} />
      </div>
    );
  }

  const commonProps = { onLogout: handleLogout, buses, setBuses, drivers, setDrivers, users, setUsers };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-x-hidden md:max-w-full">
      {currentUser.role === UserRole.STUDENT && <StudentView {...commonProps} />}
      {currentUser.role === UserRole.DRIVER && <DriverView {...commonProps} />}
      {currentUser.role === UserRole.COORDINATOR && <CoordinatorView {...commonProps} />}
      {currentUser.role === UserRole.ADMIN && <AdminView {...commonProps} />}
    </div>
  );
};

export default App;
