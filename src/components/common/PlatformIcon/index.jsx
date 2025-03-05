import React from 'react';
import './styles.css';

export function PlatformIcon({ platform, size = 'md' }) {
  const getIconContent = () => {
    switch(platform) {
      case 'youtube':
        return {
          letter: 'Y',
          className: 'youtube'
        };
      case 'twitter':
        return {
          letter: 'T',
          className: 'twitter'
        };
      case 'reddit':
        return {
          letter: 'R',
          className: 'reddit'
        };
      default:
        return {
          letter: '?',
          className: 'default'
        };
    }
  };

  const { letter, className } = getIconContent();

  return (
    <div className={`platform-icon ${className} ${size}`}>
      {letter}
    </div>
  );
} 