import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Keyboard,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import locationService from '../../services/locationService';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// India's approximate center coordinates
const INDIA_CENTER = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 25,
  longitudeDelta: 25,
};

export default function MapLocationPicker({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState(INDIA_CENTER);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    loadCurrentLocation();
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const loadCurrentLocation = async () => {
    try {
      const savedLocation = await locationService.getLastKnownLocation();
      if (savedLocation) {
        const newRegion = {
          latitude: savedLocation.latitude,
          longitude: savedLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(newRegion);
        setMarkerCoordinate({
          latitude: savedLocation.latitude,
          longitude: savedLocation.longitude,
        });
        
        const address = await locationService.getSavedAddress();
        if (address) {
          setSelectedAddress(address.formattedAddress || '');
        }
      }
    } catch (error) {
      console.error('Error loading current location:', error);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to use current location.',
          [{ text: 'OK' }]
        );
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      setMarkerCoordinate({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }

      // Get address for the location
      const address = await locationService.getAddressFromCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );
      
      if (address) {
        setSelectedAddress(address.formattedAddress || '');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleMapPress = async (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setMarkerCoordinate(coordinate);
    setIsLoadingLocation(true);

    try {
      const address = await locationService.getAddressFromCoordinates(
        coordinate.latitude,
        coordinate.longitude
      );
      
      if (address) {
        setSelectedAddress(address.formattedAddress || '');
      }
    } catch (error) {
      console.error('Error getting address:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowSearchResults(true);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('Searching for:', query);
        const results = await Location.geocodeAsync(query);
        console.log('Geocode results:', results?.length || 0);

        if (results && results.length > 0) {
          const detailedResults = await Promise.all(
            results.slice(0, 5).map(async (result, index) => {
              try {
                const addressDetails = await Location.reverseGeocodeAsync({
                  latitude: result.latitude,
                  longitude: result.longitude,
                });

                const address = addressDetails[0];
                const parts = [];

                if (address.street) parts.push(address.street);
                if (address.district) parts.push(address.district);
                if (address.city) parts.push(address.city);
                if (address.region) parts.push(address.region);

                const mainText = parts.slice(0, 2).join(', ') || query;
                const secondaryText = parts.slice(2).join(', ') || '';

                return {
                  id: `${index}`,
                  name: mainText,
                  description: secondaryText,
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
                  description: `${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`,
                  coordinates: {
                    latitude: result.latitude,
                    longitude: result.longitude,
                  },
                };
              }
            })
          );

          setSearchResults(detailedResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching location:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const handleSelectSearchResult = (result) => {
    const newRegion = {
      latitude: result.coordinates.latitude,
      longitude: result.coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setRegion(newRegion);
    setMarkerCoordinate(result.coordinates);
    setSelectedAddress(result.fullAddress?.formattedAddress || result.name);
    setShowSearchResults(false);
    setSearchQuery('');
    Keyboard.dismiss();

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  const handleConfirmLocation = async () => {
    if (!markerCoordinate) {
      Alert.alert('No Location Selected', 'Please select a location on the map.');
      return;
    }

    try {
      let address;
      if (!selectedAddress) {
        address = await locationService.getAddressFromCoordinates(
          markerCoordinate.latitude,
          markerCoordinate.longitude
        );
      } else {
        address = { formattedAddress: selectedAddress };
      }

      await locationService.updateLocation(
        markerCoordinate.latitude,
        markerCoordinate.longitude,
        address
      );

      console.log('Location confirmed and saved');
      navigation.navigate('Homepage');
    } catch (error) {
      console.error('Error confirming location:', error);
      Alert.alert('Error', 'Failed to save location. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Homepage')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Location on Map</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for city, area, or landmark..."
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setShowSearchResults(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowSearchResults(false);
              }}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results Dropdown */}
        {showSearchResults && (searchResults.length > 0 || isSearching) && (
          <View style={styles.searchResultsContainer}>
            {isSearching ? (
              <View style={styles.searchingContainer}>
                <ActivityIndicator size="small" color="#DC2626" />
                <Text style={styles.searchingText}>Searching...</Text>
              </View>
            ) : (
              searchResults.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  style={styles.searchResultItem}
                  onPress={() => handleSelectSearchResult(result)}
                >
                  <Ionicons name="location" size={20} color="#DC2626" />
                  <View style={styles.searchResultText}>
                    <Text style={styles.searchResultName}>{result.name}</Text>
                    {result.description && (
                      <Text style={styles.searchResultDescription}>
                        {result.description}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        region={region}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        loadingEnabled={true}
      >
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            draggable
            onDragEnd={handleMapPress}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="location" size={40} color="#DC2626" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Current Location Button */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={handleGetCurrentLocation}
        disabled={isLoadingLocation}
      >
        {isLoadingLocation ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Ionicons name="locate" size={24} color="#FFF" />
        )}
      </TouchableOpacity>

      {/* Selected Address Display */}
      {selectedAddress && (
        <View style={styles.addressContainer}>
          <View style={styles.addressContent}>
            <Ionicons name="location-outline" size={20} color="#DC2626" />
            <Text style={styles.addressText} numberOfLines={2}>
              {selectedAddress}
            </Text>
          </View>
        </View>
      )}

      {/* Confirm Button */}
      <View style={styles.confirmContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmLocation}
          disabled={!markerCoordinate}
        >
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFF',
    zIndex: 10,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    zIndex: 9,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  searchResultsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  searchingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchResultText: {
    marginLeft: 12,
    flex: 1,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  searchResultDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationButton: {
    position: 'absolute',
    right: 16,
    bottom: 160,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addressContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111',
  },
  confirmContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
