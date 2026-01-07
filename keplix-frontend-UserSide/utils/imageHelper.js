// Helper to construct image URL
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Resolves the full URL for an image path.
 * Handles:
 * 1. Null/Undefined paths (returns null)
 * 2. Absolute URLs (returns { uri: path })
 * 3. Relative paths (prepends BASE_URL and returns { uri: fullPath })
 * 
 * @param {string} imagePath - The path from the backend
 * @returns {object|null} - Image source object for React Native Image component or null
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (typeof imagePath === 'string' && (imagePath.startsWith('http') || imagePath.startsWith('https'))) {
    return { uri: imagePath };
  }
  if (typeof imagePath === 'string') {
    // Remove leading slash if present to avoid double slashes, though usually fine
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return { uri: `${BASE_URL}${cleanPath}` };
  }
  return imagePath;
};
