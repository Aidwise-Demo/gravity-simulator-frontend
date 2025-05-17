import React from 'react';

const Navbar = () => (
  <nav className="w-full flex items-center justify-between px-6 py-3 bg-blue-900 shadow">
    <div className="flex items-center">
      <h1 className="text-2xl font-bold text-white">
        Target Simulator for Key Metrics
      </h1>
    </div>
    <div className="flex items-center">
      <img
        src="/Gravity_logo.svg"
        alt="Gravity Logo"
        className="h-10 w-auto"
        style={{ objectFit: 'contain' }}
      />
    </div>
  </nav>
);

export default Navbar;