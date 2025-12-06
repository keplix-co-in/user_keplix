import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
  PanResponder,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from "react-native-vector-icons/Foundation";
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reviewsAPI } from '../../services/api';

const CustomSlider = ({ min, max, value, step, onChange }) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const position = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const newPosition = getPositionFromValue(value);
    position.setValue(newPosition);
  }, [value]);

  const getValueFromPosition = (pos) => {
    const range = max - min;
    const percentage = pos / sliderWidth;
    const value = min + percentage * range;
    const steppedValue = Math.round(value / step) * step;
    return Math.min(max, Math.max(min, steppedValue));
  };

  const getPositionFromValue = (value) => {
    const range = max - min;
    const percentage = (value - min) / range;
    return percentage * sliderWidth;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newPosition = Math.min(
        sliderWidth,
        Math.max(0, gestureState.dx + position._value)
      );
      position.setValue(newPosition);
      const newValue = getValueFromPosition(newPosition);
      onChange(newValue);
    },
    onPanResponderRelease: () => {
      const finalValue = getValueFromPosition(position._value);
      onChange(finalValue);
    },
  });

  return (
    <View
      className="h-10 justify-center relative"
      onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
    >
      <View className="h-1 bg-[#E2E2E2] rounded-sm" />
      <Animated.View
        className="h-1 bg-[#DC2626] rounded-sm absolute"
        style={{ width: position }}
      />
      <Animated.View
        {...panResponder.panHandlers}
        className="w-5 h-5 bg-[#DC2626] rounded-full absolute top-2.5 -ml-2.5"
        style={{
          transform: [{ translateX: position }],
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      />
    </View>
  );
};


export default function ReviewList({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState(10);
  const [price, setPrice] = useState(25000);
  const [rating, setRating] = useState(4);
  const [activeFilters, setActiveFilters] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserReviews();
  }, []);

  const loadUserReviews = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user_data');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);

        // Fetch user's reviews
        const response = await reviewsAPI.getReviews({ user_id: user.id });
        if (response.data) {
          setReviews(response.data);
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      Alert.alert('Error', 'Failed to load your reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await reviewsAPI.deleteReview(reviewId, userData.id);
              setReviews(reviews.filter(review => review.id !== reviewId));
              Alert.alert('Success', 'Review deleted successfully');
            } catch (error) {
              console.error('Error deleting review:', error);
              Alert.alert('Error', 'Failed to delete review');
            }
          },
        },
      ]
    );
  };

  const providers = [
    {
      id: '1',
      name: 'Dwarka mor service',
      rating: 4.0,
      price: '₹9,499',
      distance: '7 km',
      image: require('../../assets/images/p1.png'),
      date: 'April 18, 2025',
    },
    {
      id: '2',
      name: 'Shreeji Automotives',
      rating: 3.0,
      price: '₹8,499',
      distance: '14 km',
      image: require('../../assets/images/p2.png'),
      date: 'April 15, 2025',
    },
    {
      id: '3',
      name: 'Fix My Cars',
      rating: 4.0,
      price: '₹9,799',
      distance: '12 km',
      image: require('../../assets/images/p3.png'),
      date: 'April 12, 2025',
    },
  ];

  const applyFilters = () => {
    const newFilters = [];
    
    newFilters.push(`${distance}km`);
    newFilters.push(`Below ₹${(price/1000).toFixed(0)}k`);
    newFilters.push(`${rating}.0+ rating`);
    
    setActiveFilters(newFilters);
    setModalVisible(false);
  };

  const removeFilter = (index) => {
    const newFilters = activeFilters.filter((_, i) => i !== index);
    setActiveFilters(newFilters);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const renderProvider = ({ item }) => (
    <View>
      <Text className="text-sm text-[#0000008F] font-medium font-['DM'] mb-1 ml-1">
        {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : 'Date not available'}
      </Text>
      <TouchableOpacity 
        className="flex-row items-center mb-4 border-2 border-[#E2E2E2] rounded-[20px] p-2.5 bg-white" 
        onPress={() => navigation.navigate("Review", { 
          booking: { id: item.booking },
          vendor: { id: item.vendor },
        })}
      >
        <Image 
          source={
            item.vendor_profile_picture 
              ? { uri: item.vendor_profile_picture }
              : require('../../assets/images/p1.png')
          }
          className="w-[120px] h-[120px] rounded-2xl mr-2.5" 
        />
        <View className="flex-1">
          <Text className="text-lg font-medium text-black font-['DM'] mb-1">
            {item.vendor_name || 'Service Provider'}
          </Text>
          <View className="flex-row items-center mb-1">
            <Text className="text-base text-[#0000008F] font-['DM'] font-medium mr-1">
              {item.rating}{' '}
              <MaterialIcons name="star" size={16} color="#DC2626" />
            </Text>
            {item.distance && (
              <>
                <Text className="text-base text-black font-['DM'] font-medium">• {item.distance}</Text>
                <Ionicons name="location" size={20} color="#000" />
              </>
            )}
          </View>
          <Text className="text-sm text-[#666] font-['DM'] mb-2" numberOfLines={2}>
            {item.comment || 'No comment'}
          </Text>
          <TouchableOpacity 
            onPress={() => handleDeleteReview(item.id)}
            className="self-start px-3 py-1 bg-red-100 rounded-lg"
          >
            <Text className="text-red-600 text-xs font-medium">Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white p-5 pb-0" edges={['top']}>
      <View className="flex-row items-center mb-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} size={30} color="#000" style={{borderColor: '#E2E2E2', borderWidth: 2, borderRadius: 50, padding: 5}} />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-black font-['DM'] ml-4">My Reviews</Text>
      </View>

      {showSearch && (
        <View className="flex-row items-center border-2 border-[#E2E2E2] rounded-[37px] px-2.5 py-1 mb-5">
          <TextInput
            className="flex-1 text-base text-[#0000008F] font-medium font-['DM']"
            placeholder="Search reviews..."
            placeholderTextColor="#0000008F"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Ionicons name="search-outline" size={24} color="#0000008F" />
        </View>
      )}

      <View className="flex-row justify-between items-center px-1 mb-2.5">
        <Text className="text-base text-[#0000008F] font-medium font-['DM'] mb-2.5">
          {reviews.length} reviews {activeFilters.length > 0 ? `• ${activeFilters.length} filters applied` : ''}
        </Text>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={toggleSearch} className="ml-2.5">
            <Ionicons name="search" size={24} color="rgba(78, 70, 180, 1)" style={{borderColor: '#E2E2E2', borderWidth: 2, borderRadius: 50, padding: 6}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} className="ml-2.5">
            <Foundation name="filter" size={24} color="rgba(78, 70, 180, 1)" style={{borderColor: '#E2E2E2', borderWidth: 2, borderRadius: 50, padding: 6}} />
          </TouchableOpacity>
        </View>
      </View>

      {activeFilters.length > 0 && (
        <View className="flex-row flex-wrap mb-5">
          {activeFilters.map((filter, index) => (
            <TouchableOpacity key={index} className="flex-row items-center bg-[#E2E2E2] rounded-[20px] px-2.5 py-1 mr-2.5 mb-2.5">
              <Text className="text-base text-black font-medium font-['DM'] mr-1">{filter}</Text>
              <TouchableOpacity onPress={() => removeFilter(index)}>
                <Entypo name="squared-cross" size={24} color="#DC2626" style={{borderRadius: 12}} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#DC2626" />
          <Text className="mt-4 text-base text-[#666] font-['DM']">Loading reviews...</Text>
        </View>
      ) : reviews.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="star-outline" size={64} color="#ccc" />
          <Text className="mt-4 text-lg text-[#666] font-['DM']">No reviews yet</Text>
          <Text className="mt-2 text-sm text-[#999] font-['DM']">Your reviews will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{paddingBottom: 10}}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/50 justify-end" 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-t-[20px]">
            <TouchableOpacity 
              activeOpacity={1} 
              className="p-5"
              onPress={e => e.stopPropagation()}
            >
              <View className="flex-row justify-between items-center mb-5">
                <Text className="text-xl font-semibold text-black font-['DM']">Filter Options</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <View className="mb-5">
                <Text className="text-base font-medium text-black mb-2.5 font-['DM']">Distance: {distance} km</Text>
                <CustomSlider
                  min={1}
                  max={20}
                  step={1}
                  value={distance}
                  onChange={setDistance}
                />
              </View>

              <View className="mb-5">
                <Text className="text-base font-medium text-black mb-2.5 font-['DM']">Price: ₹{price.toLocaleString()}</Text>
                <CustomSlider
                  min={0}
                  max={50000}
                  step={1000}
                  value={price}
                  onChange={setPrice}
                />
              </View>

              <View className="mb-5">
                <Text className="text-base font-medium text-black mb-2.5 font-['DM']">Minimum Rating: {rating}.0</Text>
                <View className="flex-row justify-between mt-2.5">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <TouchableOpacity
                      key={value}
                      className={`w-10 h-10 rounded-full border-2 justify-center items-center ${rating === value ? 'bg-[#DC2626] border-[#DC2626]' : 'border-[#E2E2E2]'}`}
                      onPress={() => setRating(value)}
                    >
                      <Text className={`text-base font-medium ${rating === value ? 'text-white' : 'text-black'}`}>{value}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                className="bg-[#DC2626] rounded-[25px] p-4 items-center mt-5"
                onPress={applyFilters}
              >
                <Text className="text-white text-base font-semibold font-['DM']">Apply Filters</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View className="flex-row justify-around p-4 bg-white border-t border-[#eee] absolute bottom-0 left-0 right-0">
        <NavItem 
          icon="home" 
          text="Home" 
          navigation={navigation} 
          targetScreen="HomePage" 
        />
        <NavItem 
          icon="grid" 
          text="Services" 
          active
          navigation={navigation} 
          targetScreen="ServicesCard" 
        />
        <NavItem 
          icon="document-text" 
          text="Bookings" 
          navigation={navigation} 
          targetScreen="BookingList" 
        />
        <NavItem 
          icon="person" 
          text="Profile" 
          navigation={navigation} 
          targetScreen="Profile" 
        />
      </View>
    </SafeAreaView>
  );
};

const NavItem = ({ icon, text, active, navigation, targetScreen }) => (
  <TouchableOpacity 
    className="items-center flex-1" 
    onPress={() => navigation.navigate(targetScreen)}
  >
    <Ionicons 
      name={icon} 
      size={34} 
      color={active ? "#DC2626" : "#666"} 
    />
    <Text className={`text-xs mt-1 ${active ? 'text-[#DC2626]' : 'text-[#666]'}`}>{text}</Text>
  </TouchableOpacity>
);
