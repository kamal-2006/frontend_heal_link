import { API_CONFIG } from "@/config/api";

/**
 * Utility function to get the base URL for file/image serving
 * Strips /api/v1 from API base URL to get the file server base
 */
export const getFileBase = () => {
  return API_CONFIG.BASE_URL.replace(/\/api\/v1$/, "");
};

/**
 * Get full URL for an uploaded file/image
 * @param {string} filePath - Path starting with /uploads/...
 * @returns {string} - Full URL to the file
 */
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath; // Already absolute URL
  return `${getFileBase()}${filePath}`;
};
