
// Configuration de base de l'API
const API_CONFIG = {
    BASE_URL: 'http://172.16.11.221:9000/api',
    TIMEOUT: 30000, // 30 secondes
    HEADERS: {
      'Content-Type': 'application/json'
    }
  };
  
  // Fonction utilitaire pour ajouter le token d'authentification aux headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };
  
  // Fonction utilitaire pour les chemins d'API
  const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  };
  
  export { API_CONFIG, getAuthHeaders, getApiUrl };