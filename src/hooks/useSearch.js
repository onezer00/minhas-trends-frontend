import { useState, useEffect } from 'react';

const popularTags = [
  'tecnologia', 'IA', 'filmes', 'esports', 'trabalhoremoto', 
  'sustentabilidade', 'investimentos', 'medicina', 'ciência'
];

export function useSearch(allKeywords = []) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [keyboardNavActive, setKeyboardNavActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Atualizar sugestões baseado na consulta atual
  useEffect(() => {
    if (searchQuery.length < 2) {
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
      const query = searchQuery.toLowerCase();
      
      const historyMatches = searchHistory
        .filter(item => item.toLowerCase().includes(query))
        .map(item => ({
          type: 'history',
          text: item
        }));
      
      const keywordMatches = allKeywords
        .filter(keyword => keyword.includes(query) && !searchHistory.includes(keyword))
        .slice(0, 5)
        .map(keyword => ({
          type: 'keyword',
          text: keyword
        }));
      
      setSuggestions([...historyMatches, ...keywordMatches]);
    }
    
    setActiveSuggestionIndex(-1);
  }, [searchQuery, searchHistory, allKeywords]);

  // Salvar histórico de pesquisa
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    if (searchQuery.trim() !== '' && !searchHistory.includes(searchQuery.trim())) {
      const newHistory = [searchQuery.trim(), ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
    }
    
    setIsSearching(false);
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const handleKeyNavigation = (e) => {
    if (suggestions.length === 0 || !isSearching) return;
    
    setKeyboardNavActive(true);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev >= suggestions.length - 1 ? 0 : prev + 1
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
        break;
      
      case 'Enter':
        if (activeSuggestionIndex >= 0) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[activeSuggestionIndex].text);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setIsSearching(false);
        break;
      
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          setActiveSuggestionIndex(prev => 
            prev <= 0 ? suggestions.length - 1 : prev - 1
          );
        } else {
          setActiveSuggestionIndex(prev => 
            prev >= suggestions.length - 1 ? 0 : prev + 1
          );
        }
        break;
      
      default:
        break;
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    setIsSearching,
    suggestions,
    activeSuggestionIndex,
    keyboardNavActive,
    setKeyboardNavActive,
    searchHistory,
    handleSearch,
    handleSelectSuggestion,
    clearSearch,
    clearSearchHistory,
    handleKeyNavigation
  };
} 