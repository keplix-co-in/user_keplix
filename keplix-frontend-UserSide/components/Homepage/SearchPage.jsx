import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { servicesAPI } from '../../services/api';

export default function SearchPage ({navigation}) {
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadRecentSearches();
    loadCategories();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem('recent_searches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (search) => {
    try {
      const updatedSearches = [search, ...recentSearches.filter(s => s !== search)].slice(0, 10);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const removeSearchItem = async (item) => {
    try {
      const updatedSearches = recentSearches.filter((search) => search !== item);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error removing search:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await servicesAPI.getAllServices();
      // Extract unique service types/names as categories
      const uniqueCategories = [...new Set(response.data.map(s => s.name))].slice(0, 5);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    
    setLoading(true);
    try {
      const response = await servicesAPI.getAllServices();
      const results = response.data.filter(service =>
        service.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchInput.toLowerCase()) ||
        service.vendor_name?.toLowerCase().includes(searchInput.toLowerCase())
      );
      
      await saveRecentSearch(searchInput.trim());
      navigation.navigate('ProviderList', { searchQuery: searchInput.trim() });
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('ProviderList', { service: category });
  };

  const handleRecentSearchPress = async (search) => {
    setSearchInput(search);
    await saveRecentSearch(search);
    navigation.navigate('ProviderList', { searchQuery: search });
  };
  
  const defaultCategories = [
    { name: 'Detailing', icon: 'brush-outline' },
    { name: 'Repairs', icon: 'construct-outline' },
    { name: 'Car wash', icon: 'car-outline' },
    { name: 'Accessories', icon: 'sparkles-outline' },
    { name: 'Inspection', icon: 'search-outline' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories.map(c => c.name);

  return (
    <SafeAreaView className="flex-1 p-5 bg-white">
      <View className="flex-row items-center justify-between mb-5">
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900 font-dm">Search</Text>
        <View className="w-10" />
      </View>
      
      <View className="flex-row items-center border-2 border-[#E8E8E8] rounded-full px-4 py-3 mb-5">
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 ml-2 text-base text-gray-900 font-dm"
          placeholder="Search services, providers..."
          placeholderTextColor="#9CA3AF"
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {loading && <ActivityIndicator size="small" color="#DC2626" />}
        {searchInput.length > 0 && !loading && (
          <TouchableOpacity onPress={() => setSearchInput('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-lg font-bold mb-4 text-gray-900 font-dm">Featured Categories</Text>
          <View className="flex-row flex-wrap gap-2">
            {displayCategories.map((category, index) => (
              <TouchableOpacity 
                key={index} 
                className="flex-row items-center bg-red-50 border border-red-100 py-2.5 px-4 rounded-full"
                onPress={() => handleCategoryPress(typeof category === 'string' ? category : category.name)}
              >
                {typeof category === 'object' && (
                  <Ionicons name={category.icon} size={18} color="#DC2626" />
                )}
                <Text className="text-sm font-semibold text-red-600 font-dm ml-1.5">
                  {typeof category === 'string' ? category : category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {recentSearches.length > 0 && (
          <View className="mb-5">
            <Text className="text-lg font-bold mb-4 text-gray-900 font-dm">Recent Searches</Text>
            
            {recentSearches.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                className="flex-row justify-between items-center py-4 border-b border-gray-200"
                onPress={() => handleRecentSearchPress(item)}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                    <Ionicons name="time-outline" size={20} color="#6B7280" />
                  </View>
                  <Text className="ml-3 text-base text-gray-900 font-medium font-dm flex-1" numberOfLines={1}>
                    {item}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeSearchItem(item)} className="ml-2">
                  <Text className="text-sm text-red-600 font-semibold font-dm">Remove</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

