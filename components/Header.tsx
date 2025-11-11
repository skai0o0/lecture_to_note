import React from 'react';

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 0-4 4c0 3 2 5 2 5s-2 2-2 5a4 4 0 0 0 4 4c0-3-2-5-2-5s2-2 2-5a4 4 0 0 0-4-4z" />
    <path d="M12 2a4 4 0 0 1 4 4c0 3-2 5-2 5s2 2 2 5a4 4 0 0 1-4 4c0-3 2-5 2-5s-2-2-2-5a4 4 0 0 1 4-4z" />
    <path d="M12 6v12" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4 12H2" />
    <path d="M22 12h-2" />
    <path d="M6 7H4" />
    <path d="M20 7h-2" />
    <path d="M6 17H4" />
    <path d="M20 17h-2" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center space-x-3">
        <BrainIcon />
        <h1 className="text-2xl font-bold text-secondary tracking-tight">
          HocMeLy
        </h1>
      </div>
    </header>
  );
};