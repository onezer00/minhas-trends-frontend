import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Search, 
  Clock
} from 'lucide-react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { TrendCard } from './components/trends/TrendCard';
import { Pagination } from './components/common/Pagination';
import api from './services/api';

const TrendPulseApp = () => {
  // Estados existentes
  const [activeTab, setActiveTab] = useState('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [filteredTrends, setFilteredTrends] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trends, setTrends] = useState([]);
  
  // Novo estado para categorias
  // eslint-disable-next-line no-unused-vars
  const [categories, setCategories] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // Estado para controlar a navegação por teclado
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [keyboardNavActive, setKeyboardNavActive] = useState(false);
  
  const [searchHistory, setSearchHistory] = useState(() => {
    // Carregar histórico de pesquisa do localStorage se disponível
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    // Verificar se há uma preferência salva no localStorage
    const savedTheme = localStorage.getItem('darkMode');
    // Verificar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return savedTheme !== null 
      ? JSON.parse(savedTheme) 
      : prefersDark;
  });

  const trendsRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const suggestionsListRef = useRef(null);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  
  // Referência para o container de tendências
  const [cardsPerRow, setCardsPerRow] = useState(3); // Valor padrão
  
  // Efeito para aplicar ou remover a classe 'dark' no HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Salvar preferência no localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Função para alternar o modo escuro
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  // Inicialmente carregar todas as tendências
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/trends');
        setTrends(response.data);
        setFilteredTrends(response.data);
      } catch (err) {
        setError('Erro ao carregar tendências. Por favor, tente novamente mais tarde.');
        console.error('Erro ao buscar tendências:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  // Carregar categorias da API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get('/categories');
        
        // Formatar categorias para uso nos componentes
        const formattedCategories = [
          { id: 'all', name: 'Tudo', count: response.data.reduce((sum, cat) => sum + cat.count, 0) },
          ...response.data.map(cat => ({
            id: cat.name,
            name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
            count: cat.count
          }))
        ];
        
        setCategories(formattedCategories);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        // Em caso de erro, definir categorias padrão
        setCategories([
          { id: 'all', name: 'Tudo' },
          { id: 'tecnologia', name: 'Tecnologia' },
          { id: 'entretenimento', name: 'Entretenimento' },
          { id: 'esportes', name: 'Esportes' },
          { id: 'ciência', name: 'Ciência' },
          { id: 'finanças', name: 'Finanças' }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Extrai todas as palavras-chave únicas de todos os dados para autocompletar
  const allKeywords = useMemo(() => {
    const keywordSet = new Set();
    
    trends.forEach(trend => {
      // Adiciona palavras do título (divididas por espaço, removendo palavras comuns)
      const titleWords = trend.title.toLowerCase().split(' ')
        .filter(word => word.length > 3 && !['como', 'para', 'mais', 'está', 'esse', 'essa', 'este', 'esta'].includes(word));
      titleWords.forEach(word => keywordSet.add(word));
      
      // Adiciona todas as tags
      trend.tags.forEach(tag => keywordSet.add(tag.toLowerCase()));
      
      // Adiciona a categoria
      keywordSet.add(trend.category.toLowerCase());
      
      // Adiciona a plataforma
      keywordSet.add(trend.platform.toLowerCase());
    });
    
    return Array.from(keywordSet);
  }, [trends]);
  
  // Tags populares predefinidas
  const popularTags = useMemo(() => [
    'tecnologia', 'IA', 'filmes', 'esports', 'trabalhoremoto', 
    'sustentabilidade', 'investimentos', 'medicina', 'ciência'
  ], []);

  // Função para filtrar as tendências com animação
  const filterTrends = useCallback(() => {
    // Inicia a animação
    setIsAnimating(true);
    
    // Se temos uma referência para o elemento da lista
    if (trendsRef.current) {
      trendsRef.current.style.opacity = '0';
      trendsRef.current.style.transform = 'translateY(20px)';
    }
    
    // Pequeno atraso para a animação ser perceptível
    setTimeout(() => {
      let filtered = [...trends];
      
      // Filtrar por categoria
      if (activeTab !== 'all') {
        filtered = filtered.filter(trend => trend.category === activeTab);
      }
      
      // Filtrar por plataforma
      if (selectedPlatform !== 'all') {
        filtered = filtered.filter(trend => trend.platform === selectedPlatform);
      }
      
      // Filtrar por pesquisa
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(trend => 
          trend.title.toLowerCase().includes(query) || 
          trend.description.toLowerCase().includes(query) ||
          trend.tags.some(tag => tag.toLowerCase().includes(query)) ||
          trend.author.toLowerCase().includes(query) ||
          trend.platform.toLowerCase().includes(query) ||
          trend.category.toLowerCase().includes(query)
        );
      }
      
      setFilteredTrends(filtered);
      // Resetar para a primeira página quando os filtros mudam
      setCurrentPage(1);
      
      // Restaura a opacidade após um pequeno atraso
      setTimeout(() => {
        if (trendsRef.current) {
          trendsRef.current.style.opacity = '1';
          trendsRef.current.style.transform = 'translateY(0)';
        }
        setIsAnimating(false);
      }, 50);
    }, 200);
  }, [activeTab, selectedPlatform, searchQuery, trends]);

  // Aplicar filtros quando a categoria, plataforma ou pesquisa mudar
  useEffect(() => {
    filterTrends();
  }, [filterTrends]);

  // Salvar histórico de pesquisa no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Atualizar sugestões baseado na consulta atual
  useEffect(() => {
    if (searchQuery.length < 2) {
      // Se a consulta for muito curta, mostra histórico e tags populares
      const historySuggestions = searchHistory.map(item => ({
        type: 'history',
        text: item
      }));
      
      const tagSuggestions = popularTags.slice(0, 5).map(tag => ({
        type: 'tag',
        text: tag
      }));
      
      setSuggestions([...historySuggestions, ...tagSuggestions]);
    } else {
      // Caso contrário, filtra as palavras-chave baseado na consulta
      const query = searchQuery.toLowerCase();
      
      // Primeiro, verifica no histórico de pesquisa
      const historyMatches = searchHistory
        .filter(item => item.toLowerCase().includes(query))
        .map(item => ({
          type: 'history',
          text: item
        }));
      
      // Depois, verifica nas palavras-chave extraídas
      const keywordMatches = allKeywords
        .filter(keyword => keyword.includes(query) && !searchHistory.includes(keyword))
        .slice(0, 5)
        .map(keyword => ({
          type: 'keyword',
          text: keyword
        }));
      
      // Combina os resultados, priorizando histórico
      setSuggestions([...historyMatches, ...keywordMatches]);
    }
    
    // Resetar o índice de seleção quando as sugestões mudam
    setActiveSuggestionIndex(-1);
  }, [searchQuery, searchHistory, allKeywords, popularTags]);

  // Efeito para fazer scroll para a sugestão atualmente ativa (quando navegando com teclado)
  useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionsListRef.current && keyboardNavActive) {
      const suggestionElements = suggestionsListRef.current.querySelectorAll('.suggestion-item');
      
      if (suggestionElements[activeSuggestionIndex]) {
        const activeElement = suggestionElements[activeSuggestionIndex];
        
        // Scroll para o elemento ativo se estiver fora da área visível
        const container = suggestionsListRef.current;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;
        const elementTop = activeElement.offsetTop;
        const elementBottom = elementTop + activeElement.clientHeight;
        
        if (elementTop < containerTop) {
          // Scroll para cima se o elemento estiver acima
          container.scrollTop = elementTop;
        } else if (elementBottom > containerBottom) {
          // Scroll para baixo se o elemento estiver abaixo
          container.scrollTop = elementBottom - container.clientHeight;
        }
      }
    }
  }, [activeSuggestionIndex, keyboardNavActive]);

  // Adicionar event listener para fechar o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Função para lidar com a pesquisa
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    // Adiciona a pesquisa atual ao histórico se não estiver vazia
    if (searchQuery.trim() !== '' && !searchHistory.includes(searchQuery.trim())) {
      const newHistory = [searchQuery.trim(), ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
    }
    
    setIsSearching(false);
    // A pesquisa já acontece automaticamente por causa do useEffect
  };

  // Função para selecionar uma sugestão
  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Função para limpar a pesquisa
  // Mantida para uso futuro na interface
  /* eslint-disable-next-line no-unused-vars */
  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Função para lidar com teclas de navegação nas sugestões (melhorada)
  const handleKeyDown = (e) => {
    // Se não houver sugestões ou não estiver pesquisando, não faz nada
    if (suggestions.length === 0 || !isSearching) return;
    
    setKeyboardNavActive(true);
    
    // Seta para baixo
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev >= suggestions.length - 1 ? 0 : prev + 1
      );
    }
    
    // Seta para cima
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    }
    
    // Enter para selecionar a sugestão ativa
    else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeSuggestionIndex].text);
    }
    
    // Esc para fechar sugestões
    else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearching(false);
    }
    
    // Tab para navegar entre as sugestões
    else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift+Tab para ir para a sugestão anterior
        setActiveSuggestionIndex(prev => 
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
      } else {
        // Tab para ir para a próxima sugestão
        setActiveSuggestionIndex(prev => 
          prev >= suggestions.length - 1 ? 0 : prev + 1
        );
      }
    }
  };
  
  // Função para lidar com o mouse sobre as sugestões
  /* eslint-disable-next-line no-unused-vars */
  const handleSuggestionHover = (index) => {
    setActiveSuggestionIndex(index);
    setKeyboardNavActive(false);
  };

  // Função para limpar o histórico de pesquisa
  /* eslint-disable-next-line no-unused-vars */
  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  // Componente para ícones de plataforma
  /* eslint-disable-next-line no-unused-vars */
  const PlatformIcon = ({ platform }) => {
    switch(platform) {
      case 'youtube':
        return (
          <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white font-bold platform-icon">
            Y
          </div>
        );
      case 'twitter':
        return (
          <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold platform-icon">
            T
          </div>
        );
      case 'reddit':
        return (
          <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold platform-icon">
            R
          </div>
        );
      default:
        return null;
    }
  };
  
  // Função para exibir o tipo de ícone da sugestão
  /* eslint-disable-next-line no-unused-vars */
  const getSuggestionIcon = (type) => {
    switch(type) {
      case 'history':
        return <Clock size={16} className="text-gray-400" />;
      case 'tag':
        return <span className="text-purple-500 font-medium">#</span>;
      default:
        return <Search size={16} className="text-gray-400" />;
    }
  };

  // Calcular tendências paginadas
  const paginatedTrends = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTrends.slice(startIndex, endIndex);
  }, [filteredTrends, currentPage, itemsPerPage]);
  
  // Calcular total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(filteredTrends.length / itemsPerPage);
  }, [filteredTrends, itemsPerPage]);
  
  // Função para lidar com a mudança de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    // Scroll suave para o topo da grade
    if (trendsRef.current) {
      trendsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Função para mudar itens por página
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Resetar para a primeira página
  };

  // Função para mudar a categoria ativa
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Função para mudar a plataforma selecionada
  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
  };

  // Função para lidar com clique em tags
  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    // Adicionar ao histórico de pesquisa
    if (!searchHistory.includes(tag)) {
      setSearchHistory(prev => [tag, ...prev].slice(0, 10));
    }
  };

  // Função para lidar com clique em tendências
  const handleTrendClick = (trend) => {
    if (trend.url) {
      window.open(trend.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Detectar quantos cards cabem por linha
  useEffect(() => {
    const detectCardsPerRow = () => {
      if (trendsRef.current) {
        const containerWidth = trendsRef.current.offsetWidth;
        const cardWidth = 300; // Largura mínima de um card + gap
        const gap = 24; // Valor do gap (var(--spacing-6))
        const calculatedCards = Math.floor(containerWidth / (cardWidth + gap));
        setCardsPerRow(Math.max(1, calculatedCards));
        
        // Ajustar itemsPerPage para ser múltiplo de cardsPerRow
        const newItemsPerPage = calculatedCards * 3; // 3 linhas por padrão
        setItemsPerPage(newItemsPerPage);
      }
    };
    
    detectCardsPerRow();
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', detectCardsPerRow);
    
    return () => {
      window.removeEventListener('resize', detectCardsPerRow);
    };
  }, []);

  return (
    <div className="app">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onSearchClear={() => setSearchQuery('')}
        onSearchFocus={() => setIsSearching(true)}
        onSearchKeyDown={handleKeyDown}
        onMobileMenuToggle={() => setShowMobileMenu(true)}
        isMobile={window.innerWidth <= 768}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <div className="app-content">
        <Sidebar 
          selectedPlatform={selectedPlatform}
          onPlatformSelect={handlePlatformChange}
          selectedCategory={activeTab}
          onCategorySelect={handleTabChange}
          showMobileMenu={showMobileMenu}
          onMobileMenuClose={() => setShowMobileMenu(false)}
          isMobile={window.innerWidth <= 768}
        />
        
        <main className="main-content">
          {isSearching && suggestions.length > 0 && (
            <div 
              className="search-suggestions" 
              ref={suggestionsRef}
            >
              <div className="search-history-header">
                <h3>Sugestões</h3>
                {searchHistory.length > 0 && (
                  <button 
                    className="clear-history-btn"
                    onClick={clearSearchHistory}
                  >
                    Limpar histórico
                  </button>
                )}
              </div>
              
              <div 
                className="max-h-60 overflow-y-auto"
                ref={suggestionsListRef}
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.text}`}
                    className={`suggestion-item w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${index === activeSuggestionIndex ? 'active' : ''}`}
                    onClick={() => handleSelectSuggestion(suggestion.text)}
                    onMouseEnter={() => handleSuggestionHover(index)}
                  >
                    <div className="flex items-center">
                      <span className="suggestion-icon mr-2">
                        {getSuggestionIcon(suggestion.type)}
                      </span>
                      <span className="suggestion-highlight">
                        <HighlightText text={suggestion.text} query={searchQuery} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="keyboard-nav-tips">
                <div className="keyboard-arrows">
                  <span>↑</span>
                  <span>↓</span>
                </div>
                <span>para navegar</span>
                <span className="mx-2">•</span>
                <span>Enter</span>
                <span>para selecionar</span>
                <span className="mx-2">•</span>
                <span>Esc</span>
                <span>para fechar</span>
              </div>
            </div>
          )}
          
          {searchQuery && (
            <div className="search-results-indicator mb-4">
              <div className="search-count">
                <span>Resultados para: </span>
                <strong>{searchQuery}</strong>
                <span className="ml-2">({filteredTrends.length} encontrados)</span>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando tendências...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Tentar novamente
              </button>
            </div>
          ) : filteredTrends.length === 0 ? (
            <div className="error-state">
              <p>Nenhuma tendência encontrada para os filtros selecionados.</p>
              <button onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
                setSelectedPlatform('all');
              }}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div 
                className="trends-grid" 
                ref={trendsRef}
              >
                {paginatedTrends.map(trend => (
                  <TrendCard
                    key={trend.id}
                    trend={trend}
                    searchQuery={searchQuery}
                    onTagClick={handleTagClick}
                    onClick={() => handleTrendClick(trend)}
                  />
                ))}
              </div>
              
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={filteredTrends.length}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// Componente para destacar texto que corresponde à consulta de pesquisa
/* eslint-disable-next-line no-unused-vars */
const HighlightText = ({ text, query }) => {
  if (!query || query.trim() === '') return text;
  
  try {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 dark:bg-yellow-900 text-gray-900 dark:text-gray-100 px-1 rounded-sm">
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
};

export default TrendPulseApp;