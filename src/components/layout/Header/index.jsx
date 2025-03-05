import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { SearchBar } from '../../search/SearchBar';
import './styles.css';

export function Header({
  searchQuery,
  onSearchChange,
  onSearch,
  onSearchClear,
  onSearchFocus,
  onSearchKeyDown,
  onMobileMenuToggle,
  isMobile = false
}) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          {isMobile && (
            <button 
              onClick={onMobileMenuToggle}
              className="mobile-menu-button"
            >
              <Menu size={24} />
            </button>
          )}
          <h1 className="logo">TrendPulse</h1>
        </div>
        
        <div className="header-center">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSearch={onSearch}
            onClear={onSearchClear}
            onFocus={onSearchFocus}
            onKeyDown={onSearchKeyDown}
            className="header-search"
          />
        </div>
        
        <div className="header-right">
          <button 
            onClick={toggleDarkMode}
            className="theme-toggle-button"
            aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {darkMode ? (
              <Sun className="theme-icon sun" size={20} />
            ) : (
              <Moon className="theme-icon moon" size={20} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
} 