import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, TextInput, Modal, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingsAPI } from '../../services/api';
import { getImageUrl } from '../../utils/imageHelper';

// Memoized BookingCard component
const BookingCard = memo(({ booking, onViewDetails }) => {
  const defaultImage = require('../../assets/images/p1.png');
  const serviceImage = getImageUrl(booking.service?.image_url) || defaultImage;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <View className="bg-white border border-gray-100 rounded-2xl mb-4 mx-5 p-4 shadow-sm">
      {/* Top Section: Image and Details */}
      <View className="flex-row">
        <Image
          source={serviceImage}
          className="w-24 h-24 rounded-xl bg-gray-100"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4 justify-between py-1">
          <View>
            <Text className="text-base font-bold font-dm text-gray-900" numberOfLines={1}>
              {booking.service?.name || 'Service Name'}
            </Text>
            <Text className="text-xs text-gray-500 font-dm mt-1" numberOfLines={1}>
              {booking.service?.vendor_name || 'Vendor Name'}
            </Text>
          </View>
          <View>
            <Text className="text-lg font-bold font-dm text-gray-900">
              ₹{booking.service?.price?.toLocaleString('en-IN') || '0'}
            </Text>
          </View>
        </View>
      </View>

      {/* Date/Time Row */}
      <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-50">
        <View className="flex-row items-center bg-red-50 px-2 py-1 rounded-md">
          <Text className="text-red-700 text-xs font-semibold font-dm">
            {formatDate(booking.booking_date)}
          </Text>
        </View>
        <Text className="text-gray-500 text-xs font-dm">
          {formatTime(booking.booking_time)}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row items-center justify-between mt-4">
        <TouchableOpacity onPress={() => console.log('Need help')}>
          <Text className="text-xs text-gray-500 font-medium font-dm underline">Need help?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#DC2626] px-6 py-2.5 rounded-lg"
          onPress={onViewDetails}
        >
          <Text className="text-white text-xs font-bold font-dm">View details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

BookingCard.displayName = 'BookingCard';

export default function BookingList({ navigation }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);

  // Search & Filter State
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Inputs (Staging)
  const [tempFilters, setTempFilters] = useState({
    date: '',
    serviceName: '',
    serviceType: 'Repairs',
    paymentType: 'Cash on delivery',
    tokenFrom: '',
    tokenTo: ''
  });

  // Active Filters (Applied)
  const [activeFilters, setActiveFilters] = useState(null);

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [allBookings, activeTab, activeFilters, searchQuery]);

  const fetchUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.user_id || user.id);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getUserBookings(userId);
      setAllBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allBookings];

    // 1. Tab Filtering
    filtered = filtered.filter(booking => {
      if (activeTab === 'upcoming') return ['confirmed', 'pending', 'scheduled', 'accepted', 'in_queue'].includes(booking.status);
      if (activeTab === 'completed') return booking.status === 'completed';
      if (activeTab === 'rescheduled') return booking.status === 'rescheduled';
      return false;
    });

    // 2. Search Query Filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.service?.name?.toLowerCase().includes(query) ||
        b.service?.vendor_name?.toLowerCase().includes(query)
      );
    }

    // 3. Modal Filters (if applied)
    if (activeFilters) {
      if (activeFilters.date) {
        filtered = filtered.filter(b => b.booking_date.includes(activeFilters.date));
      }
      if (activeFilters.serviceName) {
        filtered = filtered.filter(b => b.service?.name?.toLowerCase().includes(activeFilters.serviceName.toLowerCase()));
      }
      if (activeFilters.serviceType) {
        filtered = filtered.filter(b => b.service?.category?.toLowerCase().includes(activeFilters.serviceType.toLowerCase()));
      }
      if (activeFilters.paymentType) {
        // filtered = filtered.filter(b => b.payment_method?.toLowerCase().includes(activeFilters.paymentType.toLowerCase()));
      }
      if (activeFilters.tokenFrom) {
        filtered = filtered.filter(b => b.service?.price >= parseFloat(activeFilters.tokenFrom));
      }
      if (activeFilters.tokenTo) {
        filtered = filtered.filter(b => b.service?.price <= parseFloat(activeFilters.tokenTo));
      }
    }

    setBookings(filtered);
  };

  const handleApplyFilters = () => {
    setActiveFilters(tempFilters);
    setFilterModalVisible(false);
  };

  const handleClearFilters = () => {
    setTempFilters({
      date: '',
      serviceName: '',
      serviceType: '',
      paymentType: '',
      tokenFrom: '',
      tokenTo: ''
    });
    setActiveFilters(null);
  };

  const renderBookingItem = useCallback(({ item }) => (
    <BookingCard
      booking={item}
      onViewDetails={() => navigation.navigate('BookingDetails', { booking: item })}
    />
  ), [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        {/* Search Bar Placeholder */}
        <View className="flex-1 flex-row items-center bg-transparent" />

        <Text className="text-lg font-bold text-gray-900 font-dm mr-auto ml-auto absolute left-0 right-0 text-center -z-10">
          {activeTab === 'upcoming' ? 'Upcoming' : activeTab === 'completed' ? 'Completed' : 'Resched'}
        </Text>
      </View>

      {/* Search / Date Row */}
      <View className="flex-row items-center justify-between px-5 py-4 min-h-[70px]">
        {searchVisible ? (
          <View className="flex-1 flex-row items-center bg-gray-50 rounded-full px-4 py-2 mr-3 border border-gray-200">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-base font-dm text-gray-900"
              placeholder="Search bookings..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => {
              setSearchVisible(false);
              setSearchQuery('');
            }}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold text-gray-900 font-dm mr-2">20 Sept.</Text>
            <Text className="text-base text-gray-500 font-dm">Today</Text>
          </View>
        )}

        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`w-10 h-10 rounded-full border items-center justify-center ${searchVisible ? 'bg-red-50 border-red-200' : 'border-gray-200'}`}
            onPress={() => setSearchVisible(!searchVisible)}
          >
            <Ionicons name="search-outline" size={20} color={searchVisible ? "#DC2626" : "#374151"} />
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-10 h-10 rounded-full border items-center justify-center ${activeFilters ? 'bg-red-50 border-red-200' : 'border-gray-200'}`}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="options-outline" size={20} color={activeFilters ? "#DC2626" : "#374151"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-between px-8 mb-6">
        <TouchableOpacity onPress={() => setActiveTab('upcoming')}>
          <Text className={`text-sm font-dm ${activeTab === 'upcoming' ? 'text-[#DC2626] font-bold' : 'text-gray-400'}`}>Upcoming</Text>
          {activeTab === 'upcoming' && <View className="h-0.5 bg-[#DC2626] w-full mt-1" />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('completed')}>
          <Text className={`text-sm font-dm ${activeTab === 'completed' ? 'text-[#DC2626] font-bold' : 'text-gray-400'}`}>Completed</Text>
          {activeTab === 'completed' && <View className="h-0.5 bg-[#DC2626] w-full mt-1" />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('rescheduled')}>
          <Text className={`text-sm font-dm ${activeTab === 'rescheduled' ? 'text-[#DC2626] font-bold' : 'text-gray-400'}`}>Resched</Text>
          {activeTab === 'rescheduled' && <View className="h-0.5 bg-[#DC2626] w-full mt-1" />}
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#DC2626" className="mt-10" />
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Text className="text-gray-400 font-dm">No {activeTab} bookings found</Text>
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
            <TouchableOpacity
              onPress={() => setFilterModalVisible(false)}
              className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>

            <Text className="text-lg font-bold text-gray-900 font-dm">Filters</Text>

            <TouchableOpacity onPress={handleClearFilters}>
              <Text className="text-sm font-medium text-gray-500 font-dm">Clear all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>

            {/* Date */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-500 font-dm mb-2">Date (YYYY-MM-DD)</Text>
              <View className="flex-row items-center border border-gray-200 rounded-full px-4 py-3">
                <TextInput
                  className="flex-1 text-gray-900 font-semibold font-dm text-base"
                  value={tempFilters.date}
                  onChangeText={(t) => setTempFilters({ ...tempFilters, date: t })}
                  placeholder="e.g. 2024-06-26"
                />
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </View>
            </View>

            {/* Service Name */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-500 font-dm mb-2">Service Name</Text>
              <View className="flex-row items-center border border-gray-200 rounded-full px-4 py-3">
                <TextInput
                  className="flex-1 text-gray-900 font-bold font-dm text-base"
                  value={tempFilters.serviceName}
                  onChangeText={(t) => setTempFilters({ ...tempFilters, serviceName: t })}
                  placeholder="e.g. Engine"
                />
              </View>
            </View>

            {/* Service Type */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-500 font-dm mb-2">Service Type</Text>
              <View className="flex-row items-center justify-between border border-gray-200 rounded-full px-4 py-3">
                <TextInput
                  className="flex-1 text-gray-900 font-bold font-dm text-base"
                  value={tempFilters.serviceType}
                  onChangeText={(t) => setTempFilters({ ...tempFilters, serviceType: t })}
                  placeholder="e.g. Repairs"
                />
              </View>
            </View>

            {/* Payment Type */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-500 font-dm mb-2">Payment Type</Text>
              <View className="flex-row items-center justify-between border border-gray-200 rounded-full px-4 py-3">
                <TextInput
                  className="flex-1 text-gray-900 font-bold font-dm text-base"
                  value={tempFilters.paymentType}
                  onChangeText={(t) => setTempFilters({ ...tempFilters, paymentType: t })}
                  placeholder="e.g. Cash"
                />
              </View>
            </View>

            {/* Token Range */}
            <View className="mb-8">
              <Text className="text-sm font-medium text-gray-500 font-dm mb-2">Price Range</Text>
              <View className="flex-row items-center justify-between">
                <View className="border border-gray-200 rounded-full px-6 py-3 w-[45%]">
                  <TextInput
                    className="text-gray-900 font-bold font-dm text-base text-center"
                    value={tempFilters.tokenFrom}
                    keyboardType="numeric"
                    onChangeText={(t) => setTempFilters({ ...tempFilters, tokenFrom: t })}
                    placeholder="Min"
                  />
                </View>
                <Text className="text-gray-500 font-medium">to</Text>
                <View className="border border-gray-200 rounded-full px-6 py-3 w-[45%]">
                  <TextInput
                    className="text-gray-900 font-bold font-dm text-base text-center"
                    value={tempFilters.tokenTo}
                    keyboardType="numeric"
                    onChangeText={(t) => setTempFilters({ ...tempFilters, tokenTo: t })}
                    placeholder="Max"
                  />
                </View>
              </View>
            </View>

          </ScrollView>

          {/* Apply Button */}
          <View className="p-5 border-t border-gray-100">
            <TouchableOpacity
              className="bg-[#DC2626] rounded-full py-4 items-center shadow-md"
              onPress={handleApplyFilters}
            >
              <Text className="text-white text-base font-bold font-dm">Apply Filters</Text>
            </TouchableOpacity>
            {/* Indicator Bar */}
            <View className="w-1/3 h-1 bg-black rounded-full self-center mt-6" />
          </View>

        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const mockBookings = [
  {
    id: 'mock-1',
    service: {
      name: 'Engine Repair',
      vendor_name: 'Dwarka mor service',
      price: 10499,
      image: null,
    },
    service_type: 'Repairs',
    payment_method: 'Cash on delivery',
    booking_date: '2024-06-26',
    booking_time: '16:30',
    status: 'confirmed'
  },
  {
    id: 'mock-2',
    service: {
      name: 'Car Wash',
      vendor_name: 'Speedy Clean',
      price: 500,
      image: null,
    },
    service_type: 'Cleaning',
    payment_method: 'Online',
    booking_date: '2024-06-27',
    booking_time: '10:00',
    status: 'confirmed'
  },
  {
    id: 'mock-3',
    service: {
      name: 'Periodic Service',
      vendor_name: 'City Garage',
      price: 2499,
      image: null,
    },
    service_type: 'Maintenance',
    payment_method: 'Cash on delivery',
    booking_date: '2024-06-20',
    booking_time: '12:00',
    status: 'completed'
  },
  {
    id: 'mock-4',
    service: {
      name: 'Wheel Alignment',
      vendor_name: 'Tyre Pros',
      price: 1200,
      image: null,
    },
    service_type: 'Repairs',
    payment_method: 'Wallet',
    booking_date: '2024-06-26',
    booking_time: '14:30',
    status: 'rescheduled'
  }
];
