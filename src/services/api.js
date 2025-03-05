import axios from 'axios';

// Determina a URL da API com base no ambiente
const getApiUrl = () => {
  // Verifica se estamos em produção (GitHub Pages)
  const isProduction = window.location.hostname === 'onezer00.github.io' || 
                       process.env.NODE_ENV === 'production';
  
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