import React from 'react';
import { Languages } from 'lucide-react';
import './styles.css';

export function TranslateButton() {
  return (
    <div className="translate-container">
      <button 
        className="translate-button disabled"
        disabled={true}
        title="Tradução em desenvolvimento"
      >
        <Languages size={20} />
        <span className="translate-text">Traduzir</span>
      </button>
    </div>
  );
} 