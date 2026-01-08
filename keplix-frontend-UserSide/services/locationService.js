/**
 * KEPLIX LOCATION SERVICE
 * =======================
 * Centralized location management for the entire app
 */

import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_PERMISSION_KEY = 'location_permission';
const USER_LOCATION_KEY = 'user_location';
const USER_ADDRESS_KEY = 'user_address';
const LOCATION_PERMISSION_ASKED_KEY = 'location_permission_asked';

class LocationService {
  constructor() {
    this.currentLocation = null;
    this.currentAddress = null;
    this.watchSubscription = null;
  }

  /**
   * Request location permission from user
   * @returns {Promise<Object>} Permission status and location if granted
   */
  async requestPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, status);
      await AsyncStorage.setItem(LOCATION_PERMISSION_ASKED_KEY, 'true');

      if (status === 'granted') {
        const location = await this.getCurrentLocation();
        return { status, location };
      }

      return { status, location: null };
    } catch (error) {
      console.error('Error requesting location permission:', error);
      throw error;
    }
  }

  /**
   * Check if location permission has been granted
   * @returns {Promise<boolean>}
   */
  async hasPermission() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  }

  /**
   * Get permission status from AsyncStorage
   * @returns {Promise<string|null>}
   */
  async getPermissionStatus() {
    try {
      return await AsyncStorage.getItem(LOCATION_PERMISSION_KEY);
    } catch (error) {
      console.error('Error getting permission status:', error);
      return null;
    }
  }

  /**
   * Check if user has been asked for location permission
   * @returns {Promise<boolean>}
   */
  async hasBeenAskedForPermission() {
    try {
      const asked = await AsyncStorage.getItem(LOCATION_PERMISSION_ASKED_KEY);
      return asked === 'true';
    } catch (error) {
      console.error('Error checking if permission was asked:', error);
      return false;
    }
  }

  /**
   * Get current location with high accuracy
   * @param {Object} options - Location options
   * @returns {Promise<Object>} Location coordinates
   */
  async getCurrentLocation(options = {}) {
    try {
      const hasPermission = await this.hasPermission();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: options.accuracy || Location.Accuracy.Balanced,
        maximumAge: options.maximumAge || 10000, // 10 seconds
        timeout: options.timeout || 15000, // 15 seconds
      });

      this.currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date().toISOString(),
      };

      // Save to storage
      await AsyncStorage.setItem(USER_LOCATION_KEY, JSON.stringify(this.currentLocation));

      return this.currentLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      // Try to return last known location
      return await this.getLastKnownLocation();
    }
  }

  /**
   * Get last known location from storage
   * @returns {Promise<Object|null>}
   */
  async getLastKnownLocation() {
    try {
      const locationString = await AsyncStorage.getItem(USER_LOCATION_KEY);
      if (locationString) {
        this.currentLocation = JSON.parse(locationString);
        return this.currentLocation;
      }
      return null;
    } catch (error) {
      console.error('Error getting last known location:', error);
      return null;
    }
  }

  /**
   * Get address from coordinates (reverse geocoding)
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<Object|null>}
   */
  async getAddressFromCoordinates(latitude, longitude) {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        this.currentAddress = {
          street: address.street || '',
          city: address.city || address.subregion || '',
          region: address.region || '',
          country: address.country || '',
          postalCode: address.postalCode || '',
          formattedAddress: this.formatAddress(address),
        };

        // Save to storage
        await AsyncStorage.setItem(USER_ADDRESS_KEY, JSON.stringify(this.currentAddress));

        return this.currentAddress;
      }
      return null;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return null;
    }
  }

  /**
   * Get coordinates from address (forward geocoding)
   * @param {string} address
   * @returns {Promise<Object|null>}
   */
  async getCoordinatesFromAddress(address) {
    try {
      const locations = await Location.geocodeAsync(address);
      if (locations && locations.length > 0) {
        return {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting coordinates from address:', error);
      return null;
    }
  }

  /**
   * Format address object into readable string
   * @param {Object} address
   * @returns {string}
   */
  formatAddress(address) {
    const parts = [];
    
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    else if (address.subregion) parts.push(address.subregion);
    if (address.region) parts.push(address.region);
    if (address.postalCode) parts.push(address.postalCode);

    return parts.join(', ') || 'Address not available';
  }

  /**
   * Get stored address from AsyncStorage
   * @returns {Promise<Object|null>}
   */
  async getSavedAddress() {
    try {
      const addressString = await AsyncStorage.getItem(USER_ADDRESS_KEY);
      if (addressString) {
        this.currentAddress = JSON.parse(addressString);
        return this.currentAddress;
      }
      return null;
    } catch (error) {
      console.error('Error getting saved address:', error);
      return null;
    }
  }

  /**
   * Calculate distance between two coordinates (in kilometers)
   * Using Haversine formula
   * @param {number} lat1
   * @param {number} lon1
   * @param {number} lat2
   * @param {number} lon2
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees
   * @returns {number}
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Format distance for display
   * @param {number} distanceKm - Distance in kilometers
   * @returns {string}
   */
  formatDistance(distanceKm) {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm} km`;
  }

  /**
   * Start watching location changes
   * @param {Function} callback - Called when location changes
   * @returns {Promise<Object>} Subscription object
   */
  async startWatchingLocation(callback) {
    try {
      const hasPermission = await this.hasPermission();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 100, // Update every 100 meters
        },
        (location) => {
          this.currentLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: new Date().toISOString(),
          };
          
          callback(this.currentLocation);
        }
      );

      return this.watchSubscription;
    } catch (error) {
      console.error('Error watching location:', error);
      throw error;
    }
  }

  /**
   * Stop watching location changes
   */
  stopWatchingLocation() {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
    }
  }

  /**
   * Clear all location data from storage
   */
  async clearLocationData() {
    try {
      await AsyncStorage.multiRemove([
        USER_LOCATION_KEY,
        USER_ADDRESS_KEY,
        LOCATION_PERMISSION_KEY,
      ]);
      this.currentLocation = null;
      this.currentAddress = null;
      this.stopWatchingLocation();
    } catch (error) {
      console.error('Error clearing location data:', error);
    }
  }



  /**
   * Update current location and address with provided data
   * @param {number} latitude
   * @param {number} longitude
   * @param {Object} address
   * @returns {Promise<Object>}
   */
  async updateLocation(latitude, longitude, address) {
    try {
      // Update in-memory location
      this.currentLocation = {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      };

      // Update in-memory address
      this.currentAddress = address;

      // Save to AsyncStorage
      await AsyncStorage.setItem(USER_LOCATION_KEY, JSON.stringify(this.currentLocation));
      await AsyncStorage.setItem(USER_ADDRESS_KEY, JSON.stringify(address));

      console.log('Location updated in service:', {
        location: this.currentLocation,
        address: this.currentAddress
      });

      return { location: this.currentLocation, address: this.currentAddress };
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  /**
   * Refresh current location from GPS
   * @returns {Promise<Object>}
   */
  async refreshLocation() {
    try {
      const location = await this.getCurrentLocation();
      if (location) {
        const address = await this.getAddressFromCoordinates(
          location.latitude,
          location.longitude
        );
        return { location, address };
      }
      return null;
    } catch (error) {
      console.error('Error refreshing location:', error);
      return null;
    }
  }

  /**
   * Save user's location and address to AsyncStorage
   * @param {Object} location - The location object from expo-location
   * @param {Object} address - The address object from expo-location
   */
  async saveLocation(location, address) {
    try {
      if (location) {
        await AsyncStorage.setItem(USER_LOCATION_KEY, JSON.stringify(location));
        this.currentLocation = location;
      }
      if (address) {
        await AsyncStorage.setItem(USER_ADDRESS_KEY, JSON.stringify(address));
        this.currentAddress = address;
      }
    } catch (error) {
      console.error('Error saving location data:', error);
    }
  }

  /**
   * Load saved location and address from AsyncStorage
   * @returns {Promise<{location: Object|null, address: Object|null}>}
   */
  async loadSavedLocation() {
    try {
      const locationString = await AsyncStorage.getItem(USER_LOCATION_KEY);
      const addressString = await AsyncStorage.getItem(USER_ADDRESS_KEY);

      const location = locationString ? JSON.parse(locationString) : null;
      const address = addressString ? JSON.parse(addressString) : null;

      this.currentLocation = location;
      this.currentAddress = address;

      return { location, address };
    } catch (error) {
      console.error('Error loading saved location data:', error);
      return { location: null, address: null };
    }
  }
}

// Export singleton instance
export const locationService = new LocationService();
export default locationService;
