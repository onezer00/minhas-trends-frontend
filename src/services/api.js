import axios from 'axios';

// Determina a URL da API com base no ambiente
const getApiUrl = () => {
  // Verifica se estamos em produção (GitHub Pages)
  const hostname = window.location.hostname;
  const isProduction = hostname === 'onezer00.github.io' || 
                       hostname.includes('github.io') ||
                       process.env.NODE_ENV === 'production';
  
  // Log para debug
  console.log('Hostname:', hostname);
  console.log('É produção?', isProduction);
  
  // URL da API em produção
  if (isProduction) {
    return 'https://trendpulse-api.onrender.com/api';
  }
  
  // URL da API em desenvolvimento
  return 'http://localhost:8000/api';
};

const apiUrl = getApiUrl();

const api = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Log para debug
console.log('Ambiente:', process.env.NODE_ENV);
console.log('API URL:', apiUrl);

export default api; 