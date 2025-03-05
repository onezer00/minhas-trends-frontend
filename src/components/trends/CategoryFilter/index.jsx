import React from 'react';
import './styles.css';

const categories = [
  { id: 'all', name: 'Tudo' },
  { id: 'tecnologia', name: 'Tecnologia' },
  { id: 'entretenimento', name: 'Entretenimento' },
  { id: 'esportes', name: 'Esportes' },
  { id: 'ciência', name: 'Ciência' },
  { id: 'finanças', name: 'Finanças' }
];

export function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div className="category-filter">
      <div className="category-list">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
} 