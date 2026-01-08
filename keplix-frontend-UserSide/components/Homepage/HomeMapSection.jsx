import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import locationService from '../../services/locationService';

const { width } = Dimensions.get('window');

const HomeMapSection = ({ onLocationPress }) => {
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState('Loading location...');

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      const savedLocation = await locationService.getLastKnownLocation();
      const savedAddress = await locationService.getSavedAddress();

      if (savedLocation) {
        setRegion({
          latitude: savedLocation.latitude,
          longitude: savedLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }

      if (savedAddress) {
        setAddress(savedAddress.formattedAddress || 'Location set');
      } else {
        setAddress('Set your location');
      }
    } catch (error) {
      console.error('Error loading location for home map:', error);
      setAddress('Set your location');
    }
  };

  if (!region) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.placeholder} onPress={onLocationPress}>
          <Ionicons name="map-outline" size={24} color="#6B7280" />
          <Text style={styles.placeholderText}>Tap to set your location on map</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View className="flex-row items-center flex-1">
          <Ionicons name="location" size={18} color="#EF4444" />
          <Text style={styles.title} numberOfLines={1}>{address}</Text>
        </View>
        <TouchableOpacity onPress={onLocationPress}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerDot} />
            </View>
          </Marker>
        </MapView>
        <TouchableOpacity 
          style={styles.mapOverlay} 
          onPress={onLocationPress}
          activeOpacity={1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 6,
    flex: 1,
  },
  changeText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '700',
  },
  mapContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  markerContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  placeholder: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default HomeMapSection;
