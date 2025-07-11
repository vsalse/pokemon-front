// Get API URL from runtime configuration or fallback to environment variable
export const getApiUrl = (): string => {
  // Try to get from runtime config first (for production)
  if (typeof window !== 'undefined' && (window as any).REACT_APP_API_URL) {
    return (window as any).REACT_APP_API_URL;
  }
  
  // Fallback to environment variable (for development)
  return process.env.REACT_APP_API_URL || 'http://localhost:8080';
}; 