import React from 'react';
import './styles.css';

export function CategoryFilter({ activeCategory, onCategoryChange, categories = [], loading = false }) {
  // Se não houver categorias ou estiver carregando, mostrar um placeholder
  if (loading) {
    return (
      <div className="category-filter">
        <div className="category-list loading">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="category-button-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  // Se não houver categorias, mostrar categorias padrão
  const displayCategories = categories.length > 0 
    ? categories 
    : [
        { id: 'all', name: 'Tudo' },
        { id: 'tecnologia', name: 'Tecnologia' },
        { id: 'entretenimento', name: 'Entretenimento' },
        { id: 'esportes', name: 'Esportes' },
        { id: 'ciência', name: 'Ciência' },
        { id: 'finanças', name: 'Finanças' }
      ];

  return (
    <div className="category-filter">
      <div className="category-list">
        {displayCategories.map(category => (
          <button
            key={category.id || category.name}
            onClick={() => onCategoryChange(category.id || category.name)}
            className={`category-button ${(activeCategory === category.id || activeCategory === category.name) ? 'active' : ''}`}
          >
            {category.name}
            {category.count && category.count > 0 && (
              <span className="category-count">{category.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 