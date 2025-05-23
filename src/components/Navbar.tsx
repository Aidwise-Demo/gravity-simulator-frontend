import React from 'react';

const Navbar = () => (
<nav className="w-full flex items-center justify-between px-6 py-3 shadow" style={{ background: "#006666" }}>
    <div className="flex items-center">
      <h1 className="text-[24px] font-bold text-white">
        Target Simulator for Key Metrics-Dubai Holdings
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