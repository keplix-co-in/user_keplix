import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import locationService from '../../services/locationService';
import * as Location from 'expo-location';

export default function LocationPicker({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchTimeoutRef = React.useRef(null);

  useEffect(() => {
    loadCurrentLocation();
    loadRecentSearches();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const loadCurrentLocation = async () => {
    try {
      const locationData = await locationService.getLastKnownLocation();
      if (locationData) {
        setCurrentLocation(locationData);
      }
    } catch (error) {
      console.error('Error loading current location:', error);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const recent = await AsyncStorage.getItem('recent_location_searches');
      if (recent) {
        const parsed = JSON.parse(recent);
        console.log('Loaded recent searches:', parsed.length);
        setRecentSearches(parsed);
      } else {
        console.log('No recent searches found');
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveToRecentSearches = async (locationData) => {
    try {
      if (!locationData || !locationData.location) {
        console.log('Skipping recent search - no location coordinates');
        return;
      }
      
      // Build a meaningful name for the search
      const locationName = locationData.address?.city || 
                          locationData.address?.district || 
                          locationData.address?.subregion ||
                          locationData.address?.formattedAddress?.split(',')[0] || 
                          'Location';
      
      const newSearch = {
        id: Date.now().toString(),
        name: locationName,
        description: locationData.address?.formattedAddress || '',
        street: locationData.address?.street || '',
        locality: locationData.address?.district || locationData.address?.subregion || '',
        city: locationData.address?.city || '',
        region: locationData.address?.region || '',
        country: locationData.address?.country || '',
        coordinates: locationData.location,
        fullAddress: locationData.address,
        timestamp: Date.now(),
      };

      // Keep only last 5 searches, remove duplicates by name
      const updated = [newSearch, ...recentSearches.filter(s => 
        s.name.toLowerCase() !== newSearch.name.toLowerCase()
      )].slice(0, 5);
      
      await AsyncStorage.setItem('recent_location_searches', JSON.stringify(updated));
      setRecentSearches(updated);
      console.log('Recent search saved:', locationName, '- Total searches:', updated.length);
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsLoadingCurrent(true);
    try {
      const { status } = await locationService.getPermissionStatus();
      
      if (status !== 'granted') {
        const permissionResult = await locationService.requestPermission();
        if (permissionResult.status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Location permission is required to use current location. Please enable it in settings.',
            [{ text: 'OK' }]
          );
          setIsLoadingCurrent(false);
          return;
        }
      }

      const location = await locationService.getCurrentLocation();
      if (location) {
        const address = await locationService.getAddressFromCoordinates(
          location.latitude,
          location.longitude
        );
        
        const locationData = { location, address };
        setCurrentLocation(locationData);
        
        // Save to location service
        console.log('Saving current location to service');
        await locationService.updateLocation(
          location.latitude,
          location.longitude,
          address
        );

        // Save to recent searches
        await saveToRecentSearches(locationData);
        console.log('Current location saved successfully');
        
        // Navigate to Homepage - the focus listener will reload the location
        console.log('Navigating back to Homepage');
        navigation.navigate('Homepage');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setIsLoadingCurrent(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);

    // Debounce search by 500ms
    searchTimeoutRef.current = setTimeout(async () => {
    try {
      console.log('Searching for:', query);
      // Use expo-location's geocoding to find locations matching the search
      const results = await Location.geocodeAsync(query);
      console.log('Geocode results:', results?.length || 0);
      
      if (results && results.length > 0) {
        // Get detailed address for each result
        const detailedResults = await Promise.all(
          results.slice(0, 5).map(async (result, index) => {
            try {
              const addressDetails = await Location.reverseGeocodeAsync({
                latitude: result.latitude,
                longitude: result.longitude,
              });
              
              const address = addressDetails[0];
              const parts = [];
              
              // Build address string with available parts
              if (address.street) parts.push(address.street);
              if (address.streetNumber) parts.push(address.streetNumber);
              if (address.district) parts.push(address.district);
              if (address.subregion) parts.push(address.subregion);
              if (address.city) parts.push(address.city);
              if (address.region) parts.push(address.region);
              
              const mainText = parts.slice(0, 2).join(', ') || query;
              const secondaryText = parts.slice(2).join(', ') || 'Location';
              
              return {
                id: `${index}`,
                name: mainText,
                description: secondaryText,
                street: address.street || '',
                locality: address.district || address.subregion || '',
                city: address.city || '',
                region: address.region || '',
                country: address.country || '',
                postalCode: address.postalCode || '',
                coordinates: {
                  latitude: result.latitude,
                  longitude: result.longitude,
                },
                fullAddress: address,
              };
            } catch (error) {
              console.error('Error getting address details:', error);
              return {
                id: `${index}`,
                name: query,
                description: `Lat: ${result.latitude.toFixed(4)}, Lng: ${result.longitude.toFixed(4)}`,
                coordinates: {
                  latitude: result.latitude,
                  longitude: result.longitude,
                },
              };
            }
          })
        );
        
        console.log('Setting search results:', detailedResults.length, 'results');
        setSearchResults(detailedResults);
      } else {
        console.log('No geocode results, showing custom option');
        // If no results, show the query as a custom option
        setSearchResults([
          {
            id: '0',
            name: query,
            description: 'Use this location name',
            isCustom: true,
          }
        ]);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      // Fallback to showing the query as a result
      setSearchResults([
        {
          id: '0',
          name: query,
          description: 'Use this location name',
          isCustom: true,
        }
      ]);
    } finally {
      setIsSearching(false);
    }
    }, 500); // End of setTimeout
  };

  const handleSelectLocation = async (result) => {
    Keyboard.dismiss();
    
    try {
      let locationData;

      if (result.isCustom) {
        // For custom text entry, try to geocode it
        const coordinates = await locationService.getCoordinatesFromAddress(result.name);
        if (coordinates) {
          const address = await locationService.getAddressFromCoordinates(
            coordinates.latitude,
            coordinates.longitude
          );
          
          locationData = {
            location: coordinates,
            address: address || { formattedAddress: result.name },
          };
        } else {
          // If geocoding fails, still save the address as text
          locationData = {
            location: null,
            address: { formattedAddress: result.name, city: result.name },
          };
        }
      } else if (result.coordinates) {
        // For geocoded results with coordinates (from search or recent)
        const addressText = result.fullAddress ? 
          locationService.formatAddress(result.fullAddress) : 
          `${result.name}${result.description ? ', ' + result.description : ''}`;
        
        locationData = {
          location: result.coordinates,
          address: result.fullAddress || {
            formattedAddress: addressText,
            street: result.street || '',
            city: result.city || result.name || '',
            region: result.region || '',
            country: result.country || '',
            postalCode: result.postalCode || '',
          },
        };
      } else {
        // Fallback for recent searches without full data
        locationData = {
          location: null,
          address: { 
            formattedAddress: result.description || result.name, 
            city: result.name 
          },
        };
      }

      // Save to location service if we have coordinates
      if (locationData.location) {
        console.log('Saving location to service:', locationData.address?.city || 'Unknown');
        await locationService.updateLocation(
          locationData.location.latitude,
          locationData.location.longitude,
          locationData.address
        );

        // Save to recent searches
        await saveToRecentSearches(locationData);
        console.log('Location saved successfully');
      } else {
        console.log('No coordinates to save, skipping location service update');
      }

      // Navigate to Homepage - the focus listener will reload the location
      console.log('Navigating back to Homepage');
      navigation.navigate('Homepage');
    } catch (error) {
      console.error('Error selecting location:', error);
      Alert.alert('Error', 'Failed to select location. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => {
              console.log('Back button pressed, navigating to Homepage');
              navigation.navigate('Homepage');
            }}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold font-dm flex-1">Select Location</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Search Bar */}
        <View className="px-4 py-4">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-sm font-dm"
              placeholder="Search for area, street name..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Current Location Option */}
        <TouchableOpacity
          className="px-4 py-4 border-b border-gray-100"
          onPress={handleUseCurrentLocation}
          disabled={isLoadingCurrent}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center">
              {isLoadingCurrent ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <Ionicons name="locate" size={20} color="#DC2626" />
              )}
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-sm font-semibold font-dm text-gray-900">
                Use Current Location
              </Text>
              {currentLocation?.address && (
                <Text className="text-xs text-gray-500 font-dm mt-0.5" numberOfLines={1}>
                  {currentLocation.address.formattedAddress || 'Enable location services'}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </TouchableOpacity>

        {/* Map View Option */}
        <TouchableOpacity
          className="px-4 py-4 border-b border-gray-200"
          onPress={() => {
            console.log('Opening map view');
            navigation.navigate('MapLocationPicker');
          }}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
              <Ionicons name="map" size={20} color="#2563EB" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-sm font-semibold font-dm text-gray-900">
                Select on Map
              </Text>
              <Text className="text-xs text-gray-500 font-dm mt-0.5">
                Choose location from full India map
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </TouchableOpacity>

        {/* Search Results */}
        {isSearching ? (
          <View className="px-4 py-8 items-center">
            <ActivityIndicator size="large" color="#DC2626" />
            <Text className="text-sm text-gray-500 font-dm mt-2">Searching locations...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <View className="px-4 py-2">
            <Text className="text-xs text-gray-500 font-dm mb-2 uppercase">
              {searchResults.length} {searchResults.length === 1 ? 'Location' : 'Locations'} Found
            </Text>
            {searchResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                className="py-3 border-b border-gray-100 active:bg-gray-50"
                onPress={() => handleSelectLocation(result)}
              >
                <View className="flex-row items-start">
                  <View className="w-9 h-9 bg-red-50 rounded-full items-center justify-center mt-0.5">
                    <Ionicons 
                      name={result.isCustom ? "create-outline" : "location"} 
                      size={18} 
                      color="#DC2626" 
                    />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-semibold font-dm text-gray-900" numberOfLines={1}>
                      {result.name}
                    </Text>
                    {result.description && (
                      <Text className="text-xs text-gray-500 font-dm mt-1" numberOfLines={2}>
                        {result.description}
                      </Text>
                    )}
                    {/* Show street and locality info if available */}
                    {(result.street || result.locality) && !result.isCustom && (
                      <View className="flex-row flex-wrap mt-1.5">
                        {result.street && (
                          <View className="flex-row items-center mr-3 mb-1">
                            <Ionicons name="trail-sign" size={12} color="#999" />
                            <Text className="text-[10px] text-gray-400 font-dm ml-1">
                              {result.street}
                            </Text>
                          </View>
                        )}
                        {result.locality && (
                          <View className="flex-row items-center mb-1">
                            <Ionicons name="business" size={12} color="#999" />
                            <Text className="text-[10px] text-gray-400 font-dm ml-1">
                              {result.locality}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#CCC" className="mt-1" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : searchQuery.length >= 2 ? (
          <View className="px-4 py-8 items-center">
            <Ionicons name="search-outline" size={48} color="#CCC" />
            <Text className="text-sm text-gray-500 font-dm mt-2">No results found</Text>
            <Text className="text-xs text-gray-400 font-dm mt-1 text-center">
              Try searching with a different keyword
            </Text>
          </View>
        ) : null}

        {/* Recent Searches */}
        {searchQuery.length === 0 && recentSearches.length > 0 && (
          <View className="px-4 py-2 mt-2">
            <Text className="text-xs text-gray-500 font-dm mb-2 uppercase">Recent Searches</Text>
            {recentSearches.map((recent) => (
              <TouchableOpacity
                key={recent.id}
                className="py-3 border-b border-gray-100 active:bg-gray-50"
                onPress={() => handleSelectLocation(recent)}
              >
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={20} color="#999" />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-medium font-dm text-gray-900" numberOfLines={1}>
                      {recent.name}
                    </Text>
                    {recent.description && (
                      <Text className="text-xs text-gray-500 font-dm mt-0.5" numberOfLines={1}>
                        {recent.description}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="arrow-forward" size={18} color="#CCC" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Instructions */}
        {searchQuery.length === 0 && recentSearches.length === 0 && (
          <View className="px-4 py-6">
            <Text className="text-xs text-gray-500 font-dm text-center">
              Search for your area, street, or use your current location
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
