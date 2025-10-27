/**
 * Centralized API configuration
 * All API URLs should be imported from this file
 * Environment variables are loaded from .env.local for development
 * and should be configured in Vercel for production
 */

export const API_CONFIG = {
  // Base API URL for REST endpoints
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1',
  
  // Socket.IO URL for real-time notifications
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001',
  
  // Google OAuth Client ID
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
};

// Helper function to construct full API endpoints
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
};

// Helper function to construct auth endpoint
export const getAuthUrl = (endpoint = 'me') => {
  return `${API_CONFIG.BASE_URL}/auth/${endpoint}`;
};

export default API_CONFIG;
