import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { servicesAPI } from '../../services/api';

const ServiceCard = ({ icon, title, description, onPress }) => (
  <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-2xl mb-3 border border-[#E8E8E8]" onPress={onPress}>
    <View className="w-12 h-12 bg-red-50 rounded-xl justify-center items-center mr-4">
      <Ionicons name={icon} size={24} color="#DC2626" />
    </View>
    <View className="flex-1">
      <Text className="text-lg font-bold font-dm mb-1 text-gray-900">{title}</Text>
      <Text className="text-sm text-gray-600 font-dm leading-5">
        {description || 'Complete service with professional technicians'}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

export default function SearchResult({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState(route?.params?.query || 'Engine');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(route?.params?.filters || null);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchServices(searchQuery);
    }
  }, []);

  useEffect(() => {
    // Re-search when filters are applied
    if (appliedFilters) {
      searchServices(searchQuery);
    }
  }, [appliedFilters]);

  const searchServices = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Prepare search params with filters
      const params = { search: query };
      
      if (appliedFilters) {
        if (appliedFilters.service) params.category = appliedFilters.service;
        if (appliedFilters.location) params.location = appliedFilters.location;
        if (appliedFilters.priceMin) params.price_min = appliedFilters.priceMin;
        if (appliedFilters.priceMax) params.price_max = appliedFilters.priceMax;
      }
      
      const response = await servicesAPI.searchServices(query, params);
      if (response.data) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching services:', error);
      // Fallback to default results
      setSearchResults([
        { id: 1, name: 'Engine Repair', icon: 'car', description: 'Complete service with professional technicians' },
        { id: 2, name: 'Engine Customization', icon: 'construct', description: 'Custom modifications and upgrades' },
        { id: 3, name: 'Buy Engine', icon: 'cart', description: 'New and refurbished engines available' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchServices(searchQuery);
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-5" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View className="flex-row items-center justify-between mb-5">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold font-dm text-gray-900">Search Results</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Filters', { 
            onApplyFilters: (filters) => setAppliedFilters(filters) 
          })}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center border-2 border-[#E8E8E8] rounded-full px-4 py-3 mb-5">
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 ml-2 text-base text-gray-900 font-dm"
          placeholder="Search services..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#DC2626" />
          <Text className="mt-4 text-base text-gray-500 font-dm">Searching services...</Text>
        </View>
      ) : searchResults.length === 0 ? (
        <View className="flex-1 justify-center items-center py-20">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="search-outline" size={40} color="#9CA3AF" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 font-dm">No services found</Text>
          <Text className="mt-2 text-sm text-gray-500 font-dm">Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ServiceCard
              icon={item.icon || 'car'}
              title={item.name}
              description={item.description}
              onPress={() => navigation.navigate('EngineRepairDetail', { service: item })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
