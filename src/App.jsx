import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Clock
} from 'lucide-react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { CategoryFilter } from './components/trends/CategoryFilter';
import { TrendCard } from './components/trends/TrendCard';
import { ThemeProvider } from './contexts/ThemeContext';
import api from './services/api';

const TrendPulseApp = () => {
  // Estados existentes
  const [activeTab, setActiveTab] = useState('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [filteredTrends, setFilteredTrends] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trends, setTrends] = useState([]);
  
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
  // Mantida para uso futuro na interface
  /* eslint-disable-next-line no-unused-vars */
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

  // Aplicar filtros quando a categoria, plataforma ou pesquisa mudar
  useEffect(() => {
    filterTrends();
  }, [activeTab, selectedPlatform, searchQuery, filterTrends]);

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

  // Função para filtrar as tendências com animação
  const filterTrends = () => {
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
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(trend => 
          trend.title.toLowerCase().includes(query) || 
          trend.description.toLowerCase().includes(query) || 
          trend.author.toLowerCase().includes(query) || 
          trend.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      setFilteredTrends(filtered);
      
      // Termina a animação após um curto atraso
      setTimeout(() => {
        if (trendsRef.current) {
          trendsRef.current.style.opacity = '1';
          trendsRef.current.style.transform = 'translateY(0)';
        }
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }, 50);
    }, 200);
  };

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

  return (
    <ThemeProvider>
      <div className="app">
        <Header 
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onSearch={() => {}}
          onSearchClear={() => setSearchQuery('')}
          onSearchFocus={() => setIsSearching(true)}
          onSearchKeyDown={handleKeyDown}
          onMobileMenuToggle={() => setShowMobileMenu(true)}
          isMobile={window.innerWidth <= 768}
        />
        
        <div className="app-content">
          <Sidebar 
            selectedPlatform={selectedPlatform}
            onPlatformSelect={setSelectedPlatform}
            showMobileMenu={showMobileMenu}
            onMobileMenuClose={() => setShowMobileMenu(false)}
            isMobile={window.innerWidth <= 768}
          />
          
          <main className="main-content">
            <CategoryFilter 
              activeCategory={activeTab}
              onCategoryChange={setActiveTab}
            />
            
            <div 
              ref={trendsRef}
              className="trends-grid"
              style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
                transition: 'all 0.3s ease-out'
              }}
            >
              {loading ? (
                <div className="loading-state">Carregando tendências...</div>
              ) : error ? (
                <div className="error-state">{error}</div>
              ) : (
                filteredTrends.map((trend, index) => (
                  <TrendCard
                    key={trend.id}
                    trend={trend}
                    searchQuery={searchQuery}
                    onTagClick={tag => setSearchQuery(tag)}
                    isAnimating={isAnimating}
                    index={index}
                  />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
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