import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';
import './styles.css';

export function SearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  onClear,
  onFocus,
  onKeyDown,
  placeholder = "Buscar tendências...",
  className = ""
}) {
  const searchInputRef = useRef(null);

  const handleClear = () => {
    onClear();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className={`search-bar-container ${className}`}>
      <form onSubmit={onSearch} className="search-form">
        <Search 
          className={`search-icon ${searchQuery ? 'active' : ''}`}
          size={18} 
        />
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          className="search-input"
        />
        {searchQuery && (
          <button 
            type="button"
            onClick={handleClear}
            className="clear-button"
          >
            <X size={18} />
          </button>
        )}
      </form>
    </div>
  );
} 