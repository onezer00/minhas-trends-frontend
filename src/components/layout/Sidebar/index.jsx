import React, { useState, useEffect } from 'react';
import { X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { PlatformIcon } from '../../common/PlatformIcon';
import { Logo } from '../../common/Logo';
import api from '../../../services/api';
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
  selectedCategory,
  onCategorySelect,
  showMobileMenu,
  onMobileMenuClose,
  isMobile = false
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/categories');
        
        console.log('Sidebar - Categorias recebidas da API:', response.data);
        
        // Verificar se a resposta é um array ou está dentro de um objeto
        const categoriesData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.categories || response.data.data || []);
        
        // Calcular o total de tendências para a categoria "Todas"
        const totalCount = Array.isArray(categoriesData) 
          ? categoriesData.reduce((sum, cat) => sum + (cat.count || 0), 0)
          : 0;
        
        // Adicionar a categoria "Todas" no início
        const formattedCategories = [
          { name: 'all', count: totalCount },
          ...(Array.isArray(categoriesData) ? categoriesData : [])
        ];
        
        // Ordenar categorias por contagem (exceto "Todas" que fica sempre no topo)
        formattedCategories.sort((a, b) => {
          if (a.name === 'all') return -1;
          if (b.name === 'all') return 1;
          return (b.count || 0) - (a.count || 0);
        });
        
        setCategories(formattedCategories);
      } catch (err) {
        setError('Erro ao carregar categorias');
        console.error('Erro ao buscar categorias:', err);
        
        // Em caso de erro, definir categorias padrão
        setCategories([
          { name: 'all', count: 0 },
          { name: 'tecnologia', count: 0 },
          { name: 'entretenimento', count: 0 },
          { name: 'esportes', count: 0 },
          { name: 'ciência', count: 0 },
          { name: 'finanças', count: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Função para formatar o nome da categoria para exibição
  const formatCategoryName = (name) => {
    if (name === 'all') return 'Todas';
    
    // Capitalizar primeira letra
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Limitar o número de categorias exibidas inicialmente
  const visibleCategories = showAllCategories 
    ? categories 
    : categories.slice(0, 6); // Mostrar apenas as 6 primeiras categorias

  return (
    <nav className={`sidebar ${showMobileMenu ? 'active' : ''} ${isMobile ? 'mobile' : ''}`}>
      <div className="sidebar-content">
        {isMobile && (
          <div className="mobile-header">
            <Logo size="md" />
            <button 
              onClick={onMobileMenuClose}
              className="close-button"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        <div className="sidebar-section platforms-section">
          <h3 className="section-title">Plataformas</h3>
          <ul className="sidebar-list platform-list">
            {platforms.map(platform => (
              <li key={platform.id}>
                <button 
                  onClick={() => !platform.disabled && onPlatformSelect(platform.id)}
                  className={`sidebar-button platform-button ${selectedPlatform === platform.id ? 'active' : ''} ${platform.disabled ? 'disabled' : ''}`}
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

        <div className="sidebar-section categories-section">
          <h3 className="section-title">Categorias</h3>
          {loading ? (
            <div className="loading-categories">
              <Loader2 size={18} className="animate-spin" />
              <span>Carregando categorias...</span>
            </div>
          ) : error ? (
            <div className="categories-error">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="retry-button"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              <ul className="sidebar-list category-list">
                {visibleCategories.map(category => (
                  <li key={category.name}>
                    <button 
                      onClick={() => onCategorySelect(category.name)}
                      className={`sidebar-button category-button ${selectedCategory === category.name ? 'active' : ''}`}
                    >
                      <span>{formatCategoryName(category.name)}</span>
                      <span className="category-count">{category.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
              
              {categories.length > 6 && (
                <button 
                  className="show-more-button"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                >
                  {showAllCategories ? (
                    <>
                      <span>Mostrar menos</span>
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      <span>Mostrar mais</span>
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
              )}
            </>
          )}
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