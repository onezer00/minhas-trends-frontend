import React from 'react';
import './styles.css';

export function Logo({ size = 'md', withText = true, className = '' }) {
  const sizeClass = {
    sm: 'logo-sm',
    md: 'logo-md',
    lg: 'logo-lg'
  }[size] || 'logo-md';

  return (
    <div className={`logo-container ${className}`}>
      <div className={`logo-icon ${sizeClass}`}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="url(#paint0_linear)" />
          <path d="M9.75 16C9.75 12.548 12.548 9.75 16 9.75C19.452 9.75 22.25 12.548 22.25 16C22.25 19.452 19.452 22.25 16 22.25" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M16 16L22.25 9.75" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M9.75 22.25L16 16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="16" cy="16" r="1.5" fill="white"/>
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7C3AED"/>
              <stop offset="1" stopColor="#EC4899"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {withText && (
        <div className="logo-text">
          <span className="logo-text-trend">Trend</span>
          <span className="logo-text-pulse">Pulse</span>
        </div>
      )}
    </div>
  );
} 