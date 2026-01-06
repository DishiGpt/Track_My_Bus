
import React, { useState } from 'react';
import { UserRole } from '../types';
import { MOCK_USERS } from '../mockData';
import { Button, Card } from './Shared';

interface AuthProps {
  onLogin: (role: UserRole) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'landing' | 'register' | 'login'>('landing');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS[phone];
    
    // Check if phone matches and name matches (as requested) and password matches
    if (user && user.password === password && user.name.toLowerCase() === name.toLowerCase()) {
      onLogin(user.role);
    } else if (user && user.password !== password) {
      alert("Invalid password. Please try again.");
    } else if (user && user.name.toLowerCase() !== name.toLowerCase()) {
      alert("Name does not match our records for this phone number.");
    } else {
      alert("Account not found. Please register first.");
      setView('landing');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Registration complete! Please log in with your credentials.");
    setView('login');
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen flex flex-col justify-center p-6 bg-white">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h8"/><path d="M6 10h12"/><path d="M4 10v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2"/></svg>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Track My Bus</h1>
          <p className="text-gray-500 mt-2 font-medium">Your Campus Travel Companion</p>
        </div>
        
        <div className="space-y-4 max-w-sm mx-auto w-full">
          <Button onClick={() => setView('login')} className="bg-indigo-600 text-white shadow-xl py-5">
            Login
          </Button>
          <div className="pt-4 text-center">
            <button onClick={() => setView('register')} className="text-indigo-600 font-bold hover:underline">
              Register as a student
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className="min-h-screen p-6 bg-white">
        <button onClick={() => setView('landing')} className="mb-8 text-indigo-600 font-bold flex items-center gap-2 uppercase text-xs tracking-widest">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
           Back
        </button>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Student Registration</h2>
        <p className="text-gray-500 mb-8">Enter your details to create an account.</p>
        
        <form onSubmit={handleRegister} className="space-y-5">
           <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">Full Name</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" placeholder="John Doe" />
           </div>
           <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" placeholder="john@college.edu" />
           </div>
           <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">Phone Number</label>
              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" placeholder="10-digit number" />
           </div>
           <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">Create Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900" placeholder="••••••••" />
           </div>
           <Button type="submit" className="bg-indigo-600 text-white py-5 shadow-lg !mt-10">Save Details</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <Card className="w-full max-w-md p-8 shadow-2xl border-none">
        <button onClick={() => setView('landing')} className="text-indigo-600 mb-6 flex items-center gap-1 font-bold uppercase text-xs tracking-widest">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8">Login with your registered credentials.</p>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Full Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Phone Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+91</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Mobile Number"
                className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
          </div>
          <Button type="submit" className="bg-indigo-600 text-white py-5 shadow-xl" disabled={phone.length < 10 || password.length === 0 || name.length === 0}>
            Login Now
          </Button>
          <div className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
            <p>Admin: Super Admin / 1111111111 / password123</p>
            <p>Coordinator: Raj Singh / 2222222222 / password123</p>
            <p>Driver: Ramesh Kumar / 3333333333 / password123</p>
            <p>Student: Rahul Sharma / 4444444444 / password123</p>
          </div>
        </form>
      </Card>
    </div>
  );
};
