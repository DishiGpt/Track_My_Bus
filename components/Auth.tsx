
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Button, Card } from './Shared';

interface AuthProps {
  onLogin: (phone: string, name: string, pass: string) => boolean;
  onRegister: (user: User) => void;
  users: User[];
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, users }) => {
  const [view, setView] = useState<'landing' | 'register' | 'login'>('landing');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(phone, name, password);
    if (!success) {
      alert("Invalid credentials. Please check your name, phone and password.");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      name,
      phoneNumber: phone,
      password,
      role: UserRole.STUDENT
    };
    onRegister(newUser);
    alert("Registration successful! You can now log in.");
    setView('login');
  };

  const MapBackground = () => (
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" 
        className="w-full h-full object-cover filter blur-lg brightness-110" 
        alt="Map background"
      />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px]"></div>
    </div>
  );

  if (view === 'landing') {
    return (
      <div className="min-h-screen flex flex-col justify-center p-6 relative overflow-hidden">
        <MapBackground />
        <div className="relative z-10 text-center mb-12 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h8"/><path d="M6 10h12"/><path d="M4 10v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2"/></svg>
          </div>
          <h1 className="text-4xl font-black text-black tracking-tighter drop-shadow-sm">Track My Bus</h1>
          <p className="text-black mt-2 font-bold bg-white/50 inline-block px-4 py-1 rounded-full border border-black/10">Campus Travel Companion</p>
        </div>
        
        <div className="relative z-10 space-y-4 max-w-sm mx-auto w-full">
          <Button onClick={() => setView('login')} className="bg-black text-white shadow-2xl py-5 text-lg">
            Login
          </Button>
          <div className="pt-4 text-center">
            <button onClick={() => setView('register')} className="text-black font-black hover:underline bg-white/60 px-6 py-3 rounded-2xl shadow-sm border border-black/5">
              New Student? Register here
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <MapBackground />
      <Card className="relative z-10 w-full max-w-md p-8 shadow-2xl border-2 border-black/10 bg-white/95 backdrop-blur-md">
        <button onClick={() => setView('landing')} className="text-black mb-6 flex items-center gap-1 font-black uppercase text-xs tracking-widest bg-gray-100 p-2 rounded-lg">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <h2 className="text-3xl font-black text-black mb-2">{view === 'login' ? 'Sign In' : 'Register'}</h2>
        <p className="text-gray-700 font-bold mb-8">Please enter your details below.</p>

        <form onSubmit={view === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-black uppercase mb-1">Full Name</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Exactly as registered" className="w-full p-4 bg-white border-2 border-black/20 rounded-2xl font-black text-black" />
          </div>
          <div>
            <label className="block text-xs font-black text-black uppercase mb-1">Phone Number</label>
            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" className="w-full p-4 bg-white border-2 border-black/20 rounded-2xl font-black text-black" />
          </div>
          <div>
            <label className="block text-xs font-black text-black uppercase mb-1">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-4 bg-white border-2 border-black/20 rounded-2xl font-black text-black" />
          </div>
          <Button type="submit" className="bg-black text-white py-5 shadow-2xl mt-4">
            {view === 'login' ? 'Login Now' : 'Complete Registration'}
          </Button>
          
          {view === 'login' && (
             <div className="mt-6 p-3 bg-gray-50 rounded-xl border border-black/5 text-[9px] text-gray-600 font-bold leading-tight">
               <p>Quick Access (Admin): Super Admin / 1111111111 / password123</p>
               <p>Quick Access (Coord): Raj Singh / 2222222222 / password123</p>
             </div>
          )}
        </form>
      </Card>
    </div>
  );
};
