import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { servicesAPI } from '../../services/api';

// Memoized Search Result Card
const SearchResultCard = memo(({ item, onPress }) => {
  const defaultImage = require('../../assets/images/p1.png');
  const serviceImage = item.image ? { uri: item.image } : defaultImage;

  return (
    <TouchableOpacity
      className="flex-row bg-white border border-gray-100 rounded-2xl p-3 mx-5 mb-3 shadow-sm"
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={serviceImage}
        className="w-20 h-20 rounded-xl bg-gray-100"
        resizeMode="cover"
      />

      <View className="flex-1 ml-3 justify-between">
        <View>
          <Text className="text-base font-bold font-dm text-gray-900" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-sm text-gray-600 font-dm mt-0.5" numberOfLines={1}>
            {item.vendor_name || 'Service Provider'}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#FFA500" />
            <Text className="text-sm font-semibold font-dm text-gray-900 ml-1">
              {item.rating || '4.0'}
            </Text>
          </View>

          <Text className="text-base font-bold font-dm text-red-600">
            ₹{item.price?.toLocaleString('en-IN') || '0'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

SearchResultCard.displayName = 'SearchResultCard';

// Recent Search Item
const RecentSearchItem = memo(({ text, onPress, onRemove }) => (
  <View className="flex-row items-center justify-between px-5 py-3 border-b border-gray-50">
    <TouchableOpacity
      className="flex-1 flex-row items-center"
      onPress={() => onPress(text)}
    >
      <Ionicons name="time-outline" size={18} color="#9CA3AF" />
      <Text className="text-sm text-gray-700 font-dm ml-3">{text}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onRemove(text)}>
      <Ionicons name="close" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  </View>
));

RecentSearchItem.displayName = 'RecentSearchItem';

export default function SearchPage({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const delaySearch = setTimeout(() => {
        performSearch();
      }, 300); // Debounce search

      return () => clearTimeout(delaySearch);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

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

  const saveRecentSearch = async (query) => {
    try {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      let searches = [...recentSearches];

      // Remove if already exists
      searches = searches.filter(s => s !== trimmedQuery);

      // Add to beginning
      searches.unshift(trimmedQuery);

      // Keep only last 10
      searches = searches.slice(0, 10);

      setRecentSearches(searches);
      await AsyncStorage.setItem('recent_searches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const removeRecentSearch = async (query) => {
    try {
      const searches = recentSearches.filter(s => s !== query);
      setRecentSearches(searches);
      await AsyncStorage.setItem('recent_searches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error removing recent search:', error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem('recent_searches');
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      setShowResults(true);

      const response = await servicesAPI.getAllServices();

      // Filter results based on search query
      const query = searchQuery.toLowerCase();
      const filtered = response.data.filter(service =>
        service.name?.toLowerCase().includes(query) ||
        service.vendor_name?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.category?.toLowerCase().includes(query)
      );

      setSearchResults(filtered);

      // Save to recent searches
      if (searchQuery.trim()) {
        saveRecentSearch(searchQuery);
      }
    } catch (error) {
      console.error('Error searching:', error);
      // Fallback to mock data
      const mockData = [
        {
          id: '1',
          name: 'Engine Repair',
          vendor_name: 'Dwarka mor service',
          price: 10499,
          rating: 4.0,
          image: require('../../assets/images/r1.jpg'),
        },
        {
          id: '2',
          name: 'Car Wash Premium',
          vendor_name: 'Speedy Clean',
          price: 599,
          rating: 4.5,
          image: require('../../assets/images/r.png'),
        },
        {
          id: '3',
          name: 'AC Service',
          vendor_name: 'Cool Breeze Auto',
          price: 2499,
          rating: 4.2,
          image: require('../../assets/images/r1.jpg'),
        },
        {
          id: '4',
          name: 'Brake Service',
          vendor_name: 'Safe Drive Motors',
          price: 3499,
          rating: 4.3,
          image: require('../../assets/images/r.png'),
        },
        {
          id: '5',
          name: 'Oil Change',
          vendor_name: 'Quick Service',
          price: 899,
          rating: 4.1,
          image: require('../../assets/images/r1.jpg'),
        },
        {
          id: '6',
          name: 'Tire Replacement',
          vendor_name: 'Wheel Masters',
          price: 5999,
          rating: 4.4,
          image: require('../../assets/images/r.png'),
        },
      ];

      const query = searchQuery.toLowerCase();
      const filtered = mockData.filter(service =>
        service.name?.toLowerCase().includes(query) ||
        service.vendor_name?.toLowerCase().includes(query)
      );

      setSearchResults(filtered);

      if (searchQuery.trim()) {
        saveRecentSearch(searchQuery);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResultPress = useCallback((service) => {
    navigation.navigate('EngineRepairDetail', {
      serviceId: service.id,
      serviceName: service.name,
      category: service.category || 'Service',
    });
  }, [navigation]);

  const handleRecentSearchPress = (text) => {
    setSearchQuery(text);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-gray-50 rounded-full px-4 py-1 border border-gray-200">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-base font-dm text-gray-900"
            placeholder="Search services, providers..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {showResults ? (
        // Search Results
        <View className="flex-1">
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#DC2626" />
              <Text className="text-gray-500 mt-2 font-dm">Searching...</Text>
            </View>
          ) : (
            <>
              <View className="px-5 py-3 border-b border-gray-100">
                <Text className="text-sm text-gray-600 font-dm">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </Text>
              </View>

              <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                  <SearchResultCard item={item} onPress={handleResultPress} />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
                ListEmptyComponent={
                  <View className="flex-1 justify-center items-center py-20">
                    <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                      <Ionicons name="search-outline" size={40} color="#9CA3AF" />
                    </View>
                    <Text className="text-gray-900 text-lg font-semibold font-dm">No results found</Text>
                    <Text className="text-gray-500 text-sm font-dm mt-2 text-center px-10">
                      Try searching with different keywords
                    </Text>
                  </View>
                }
              />
            </>
          )}
        </View>
      ) : (
        // Recent Searches
        <View className="flex-1">
          {recentSearches.length > 0 && (
            <>
              <View className="flex-row items-center justify-between px-5 py-3 border-b border-gray-100">
                <Text className="text-base font-bold text-gray-900 font-dm">Recent Searches</Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text className="text-sm text-red-600 font-semibold font-dm">Clear All</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={recentSearches}
                renderItem={({ item }) => (
                  <RecentSearchItem
                    text={item}
                    onPress={handleRecentSearchPress}
                    onRemove={removeRecentSearch}
                  />
                )}
                keyExtractor={(item, index) => `recent-${index}`}
              />
            </>
          )}

          {recentSearches.length === 0 && (
            <View className="flex-1 justify-center items-center px-10">
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="search-outline" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-gray-900 text-lg font-semibold font-dm text-center">
                Search for services
              </Text>
              <Text className="text-gray-500 text-sm font-dm mt-2 text-center">
                Find car services, repairs, and more
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
