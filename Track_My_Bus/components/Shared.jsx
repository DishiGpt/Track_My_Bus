import React from 'react';

export const Header = ({ title, subtitle, onLogout }) => (
  <header className="bg-indigo-700 text-white p-4 shadow-lg sticky top-0 z-50 flex justify-between items-center">
    <div>
      <h1 className="text-xl font-bold">{title}</h1>
      {subtitle && <p className="text-xs text-indigo-200">{subtitle}</p>}
    </div>
    {onLogout && (
      <button
        onClick={onLogout}
        className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-sm transition-colors border border-indigo-400"
      >
        Logout
      </button>
    )}
  </header>
);

export const Button = ({ children, className, ...props }) => (
  <button
    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Card = ({ children, className }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);
