import React, { useState } from 'react';
import { Button, Card } from './Shared';
import api from '../src/api/axios';
import OtpInput from 'otp-input-react';

export const Auth = ({ onLogin }) => {
  const [view, setView] = useState('landing');
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null); // For Signup flow
  const [step, setStep] = useState(1); // 1: Contact, 2: OTP
  const [loading, setLoading] = useState(false);

  // LOGIN FLOW
  const handleLoginRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEmail = contact.includes('@');
      const res = await api.post('/auth/login', { contact, isEmail });
      setUserId(res.data.userId); // In login flow usage, might differ, but verify-otp needs userId usually
      // Actually login API returns userId to verify against? 
      // My backend auth.js returns { message, userId } for login too
      setUserId(res.data.userId);
      setStep(2);
      alert(`OTP Sent! (Check console for mock: ${res.data.otp || 'hidden'})`);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP FLOW
  const handleRegisterRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', {
        name,
        phoneNumber: contact,
        role: 'STUDENT' // Default as per requirement
      });
      setUserId(res.data.userId);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // OTP VERIFICATION
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { userId, otp });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      onLogin(user);
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-4xl font-black text-black tracking-tighter drop-shadow-sm">Track My Bus</h1>
          <p className="text-black mt-2 font-bold bg-white/50 inline-block px-4 py-1 rounded-full border border-black/10">Campus Travel Companion</p>
        </div>
        <div className="relative z-10 space-y-4 max-w-sm mx-auto w-full">
          <Button onClick={() => { setView('login'); setStep(1); }} className="bg-black text-white shadow-2xl py-5 text-lg">Login</Button>
          <div className="pt-4 text-center">
            <button onClick={() => { setView('register'); setStep(1); }} className="text-black font-black hover:underline bg-white/60 px-6 py-3 rounded-2xl shadow-sm border border-black/5">New Student? Register here</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <MapBackground />
      <Card className="relative z-10 w-full max-w-md p-8 shadow-2xl border-2 border-black/10 bg-white/95 backdrop-blur-md">
        <button onClick={() => setView('landing')} className="text-black mb-6 flex items-center gap-1 font-black uppercase text-xs tracking-widest bg-gray-100 p-2 rounded-lg">Back</button>

        <h2 className="text-3xl font-black text-black mb-2">{view === 'login' ? 'Sign In' : 'Register'}</h2>
        <p className="text-gray-700 font-bold mb-8">{step === 1 ? 'Enter details' : 'Verify OTP'}</p>

        {step === 1 ? (
          <form onSubmit={view === 'login' ? handleLoginRequest : handleRegisterRequest} className="space-y-4">
            {view === 'register' && (
              <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Full Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-white border-2 border-black/20 rounded-2xl font-black text-black" />
              </div>
            )}
            <div>
              <label className="block text-xs font-black text-black uppercase mb-1">Phone Number / Email</label>
              <input required type="text" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full p-4 bg-white border-2 border-black/20 rounded-2xl font-black text-black" />
            </div>
            <Button type="submit" disabled={loading} className="bg-black text-white py-5 shadow-2xl mt-4">
              {loading ? 'Sending...' : 'Get OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex justify-center py-4">
              <OtpInput value={otp} onChange={setOtp} OTPLength={6} otpType="number" disabled={false} autoFocus className="otp-container" />
            </div>
            <Button type="submit" disabled={loading} className="bg-black text-white py-5 shadow-2xl mt-4">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
          </form>
        )}
      </Card>
      <style>{`
        .otp-container > div { justify-content: space-between; gap: 8px; }
        .otp-container input { width: 40px !important; height: 50px; font-size: 20px; border-radius: 12px; border: 2px solid #ddd; text-align: center; font-weight: 900; }
        .otp-container input:focus { border-color: black; outline: none; }
      `}</style>
    </div>
  );
};
