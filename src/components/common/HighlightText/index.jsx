import React from 'react';
import './styles.css';

export function HighlightText({ text, query }) {
  if (!query || query.trim() === '') return text;
  
  try {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="highlight">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  } catch (e) {
    // Fallback em caso de erro na expressão regular
    return text;
  }
} 