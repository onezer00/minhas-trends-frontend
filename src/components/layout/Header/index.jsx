import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { SearchBar } from '../../search/SearchBar';
import { Logo } from '../../common/Logo';
import { DonateButton } from '../../common/DonateButton';
import './styles.css';

export function Header({
  searchQuery,
  onSearchChange,
  onSearch,
  onSearchClear,
  onSearchFocus,
  onSearchKeyDown,
  onMobileMenuToggle,
  darkMode,
  onToggleDarkMode,
  isMobile = false
}) {
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
          <Logo size={isMobile ? 'sm' : 'md'} />
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
          <DonateButton />
          
          <button 
            onClick={onToggleDarkMode}
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