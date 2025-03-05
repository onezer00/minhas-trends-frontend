import React from 'react';
import { X } from 'lucide-react';
import { PlatformIcon } from '../../common/PlatformIcon';
import './styles.css';

const platforms = [
  { id: 'all', name: 'Todas' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'reddit', name: 'Reddit' },
  { id: 'twitter', name: 'Twitter', disabled: true }
];

export function Sidebar({
  selectedPlatform,
  onPlatformSelect,
  showMobileMenu,
  onMobileMenuClose,
  isMobile = false
}) {
  return (
    <nav className={`sidebar ${showMobileMenu ? 'active' : ''} ${isMobile ? 'mobile' : ''}`}>
      <div className="sidebar-content">
        {isMobile && (
          <div className="mobile-header">
            <h1 className="logo">TrendPulse</h1>
            <button 
              onClick={onMobileMenuClose}
              className="close-button"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        <div className="platforms-section">
          <h3 className="section-title">Plataformas</h3>
          <ul className="platform-list">
            {platforms.map(platform => (
              <li key={platform.id}>
                <button 
                  onClick={() => !platform.disabled && onPlatformSelect(platform.id)}
                  className={`platform-button ${selectedPlatform === platform.id ? 'active' : ''} ${platform.disabled ? 'disabled' : ''}`}
                  disabled={platform.disabled}
                >
                  {platform.id !== 'all' && (
                    <PlatformIcon platform={platform.id} />
                  )}
                  <span>{platform.name}</span>
                  {platform.disabled && <span className="platform-status">(Em breve)</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {isMobile && showMobileMenu && (
        <div 
          className="mobile-backdrop"
          onClick={onMobileMenuClose}
        />
      )}
    </nav>
  );
} 