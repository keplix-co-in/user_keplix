import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width } = Dimensions.get('window');

export default function Filters({ navigation, route }) {
  const { onApplyFilters } = route.params || {};
  
  // State for filters
  const [selectedDiscount, setSelectedDiscount] = useState('25% off +');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedRating, setSelectedRating] = useState(4);
  const [selectedDistance, setSelectedDistance] = useState('5km - 10km');

  // Filter Options
  const discounts = ['10% off +', '25% off +', '35% off +', '50% off +', '70% off +'];
  const distances = ['Within 1km', '1km - 5km', '5km - 10km', 'Over 20km'];

  const handleApplyFilters = () => {
    const filters = {
      discount: selectedDiscount,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      rating: selectedRating,
      distance: selectedDistance,
    };
    
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    
    navigation.navigate('SearchResult', { filters });
  };

  const handleClearAll = () => {
    setSelectedDiscount('');
    setPriceRange([0, 200000]);
    setSelectedRating(0);
    setSelectedDistance('');
  };

  const formatPrice = (price) => {
    return `₹ ${price.toLocaleString()}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 font-dm">Filters</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text className="text-sm text-gray-900 font-dm">Clear all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        
        {/* Deals and Price Section */}
        <Text className="text-lg font-bold text-gray-900 mb-4 font-dm">Deals and Price</Text>
        
        {/* Discount Chips */}
        <Text className="text-base text-gray-600 mb-3 font-dm">Discount</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {discounts.map((discount, index) => (
            <TouchableOpacity
              key={index}
              className={`px-4 py-2 rounded-lg border ${
                selectedDiscount === discount 
                  ? 'bg-[#DC2626] border-[#DC2626]' 
                  : 'bg-white border-[#E8E8E8]'
              }`}
              onPress={() => setSelectedDiscount(discount)}
            >
              <Text
                className={`text-sm font-medium font-dm ${
                  selectedDiscount === discount ? 'text-white' : 'text-gray-900'
                }`}
              >
                {discount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Range Slider */}
        <Text className="text-base text-gray-600 mb-3 font-dm">Price</Text>
        <View className="border border-[#E8E8E8] rounded-xl p-4 mb-2">
          <Text className="text-center text-base font-bold text-gray-900 font-dm mb-4">
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])} +
          </Text>
          <View className="items-center">
            <MultiSlider
              values={[priceRange[0], priceRange[1]]}
              sliderLength={width - 80}
              onValuesChange={setPriceRange}
              min={0}
              max={200000}
              step={1000}
              allowOverlap={false}
              snapped
              selectedStyle={{
                backgroundColor: '#000', // Black track as per image
              }}
              unselectedStyle={{
                backgroundColor: '#E5E7EB',
              }}
              containerStyle={{
                height: 40,
              }}
              trackStyle={{
                height: 3,
              }}
              markerStyle={{
                backgroundColor: '#DC2626', // Red thumb
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: '#fff',
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            />
          </View>
          <TouchableOpacity onPress={() => setPriceRange([0, 200000])}>
            <Text className="text-xs text-gray-400 font-dm mt-2">Reset price range</Text>
          </TouchableOpacity>
        </View>

        {/* Ratings Section */}
        <Text className="text-lg font-bold text-gray-900 mt-6 mb-4 font-dm">Ratings</Text>
        <View className="flex-row justify-between px-2 mb-6">
          {[1, 2, 3, 4, 5].map((rating) => (
            <TouchableOpacity
              key={rating}
              className="items-center"
              onPress={() => setSelectedRating(rating)}
            >
              <Ionicons 
                name="star" 
                size={32} 
                color={selectedRating >= rating ? "#DC2626" : "#E5E7EB"} 
              />
              <Text className={`text-sm mt-1 font-dm ${selectedRating >= rating ? "text-gray-900 font-bold" : "text-gray-400"}`}>
                {rating}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Distance Section */}
        <Text className="text-lg font-bold text-gray-900 mb-4 font-dm">Distance</Text>
        <View className="flex-row flex-wrap gap-3 mb-24">
          {distances.map((dist, index) => (
            <TouchableOpacity
              key={index}
              className={`px-4 py-2 rounded-lg border ${
                selectedDistance === dist 
                  ? 'bg-[#DC2626] border-[#DC2626]' 
                  : 'bg-white border-[#E8E8E8]'
              }`}
              onPress={() => setSelectedDistance(dist)}
            >
              <Text
                className={`text-sm font-medium font-dm ${
                  selectedDistance === dist ? 'text-white' : 'text-gray-900'
                }`}
              >
                {dist}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Apply Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-[#E8E8E8]">
        <TouchableOpacity 
          className="bg-[#DC2626] py-4 rounded-full items-center"
          onPress={handleApplyFilters}
        >
          <Text className="text-white text-lg font-bold font-dm">Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}