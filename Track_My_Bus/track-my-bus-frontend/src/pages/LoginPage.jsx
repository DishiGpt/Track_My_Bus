import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { requestOTP, login, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [loginMethod, setLoginMethod] = useState('phone'); // phone or email
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!phoneOrEmail) {
      setError('Please enter phone or email');
      return;
    }

    const result = await requestOTP(
      loginMethod === 'phone' ? phoneOrEmail : '',
      loginMethod === 'email' ? phoneOrEmail : '',
      'login'
    );

    if (result.success) {
      setStep(2);
      setError('');
    } else {
      setError(result.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter OTP');
      return;
    }

    const result = await login(
      loginMethod === 'phone' ? phoneOrEmail : '',
      loginMethod === 'email' ? phoneOrEmail : '',
      otp
    );

    if (result.success) {
      const role = result.data.user.role;
      navigate(
        role === 'student'
          ? '/student'
          : role === 'driver'
            ? '/driver'
            : role === 'coordinator'
              ? '/coordinator'
              : '/admin'
      );
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 rounded ${
                  loginMethod === 'phone'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                Phone
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 rounded ${
                  loginMethod === 'email'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                Email
              </button>
            </div>

            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              placeholder={
                loginMethod === 'email'
                  ? 'Enter your email'
                  : 'Enter your phone'
              }
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="bg-blue-50 p-3 rounded text-center">
              <p className="text-sm text-gray-600">
                OTP sent to {phoneOrEmail}
              </p>
            </div>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-blue-600 py-2 hover:underline"
            >
              Back
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
