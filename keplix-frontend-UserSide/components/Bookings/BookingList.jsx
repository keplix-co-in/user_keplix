import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingsAPI } from '../../services/api';
import Footer from '../Footer/Footer';

export default function BookingList({ navigation }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch user ID from AsyncStorage
  useEffect(() => {
    fetchUserId();
  }, []);

  // Fetch bookings when userId or activeTab changes
  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId, activeTab]);

  const fetchUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.user_id || user.id);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
      setError('Failed to load user data');
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookingsAPI.getUserBookings(userId);
      
      // Filter bookings based on active tab
      const now = new Date();
      const filteredBookings = response.data.filter(booking => {
        const bookingDate = new Date(booking.booking_date);
        
        if (activeTab === 'past') {
          // Past: completed or cancelled bookings, OR past date
          return booking.status === 'completed' || 
                 booking.status === 'cancelled' || 
                 bookingDate < now;
        } else {
          // Upcoming: pending or confirmed bookings with future/today date
          return (booking.status === 'pending' || booking.status === 'confirmed') && 
                 bookingDate >= now;
        }
      });
      
      setBookings(filteredBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const BookingCard = ({ booking }) => {
    // Default image if service image is not available
    const defaultImage = require('../../assets/images/p1.png');
    const serviceImage = booking.service?.image 
      ? { uri: booking.service.image } 
      : defaultImage;

    return (
      <View className="bg-white border border-[#E8E8E8] rounded-2xl mb-4 mx-5 p-4">
        <View className="flex-row">
          <View className="relative w-[120px] h-[100px] mr-4">
            <Image source={serviceImage} className="w-full h-full rounded-xl" />
            <View className="absolute bg-red-600/90 rounded-lg p-1.5 top-2 right-2">
              <MaterialCommunityIcons name="wrench" size={20} color="#fff" />
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold font-dm text-gray-900 mb-1">
              {booking.service?.name || 'Service'}
            </Text>
            <Text className="text-sm text-gray-500 font-dm mb-2">
              {booking.service?.vendor_name || 'Vendor'}
            </Text>
            <Text className="text-xs text-gray-600 font-dm mb-2">
              {`${formatDate(booking.booking_date)} • ${formatTime(booking.booking_time)}`}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className={`text-sm font-semibold font-dm capitalize ${getStatusColor(booking.status)}`}>
                {booking.status}
              </Text>
              {booking.service?.price && (
                <Text className="text-lg font-bold text-gray-900 font-dm">₹{booking.service.price}</Text>
              )}
            </View>
          </View>
        </View>
        <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
          <TouchableOpacity 
            className="py-2 px-4" 
            onPress={() => navigation.navigate('BookingDetails', { booking })}
          >
            <Text className="text-sm font-semibold font-dm text-red-600">View Details</Text>
          </TouchableOpacity>
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <TouchableOpacity 
              className="bg-red-600 flex-row items-center py-2 px-5 rounded-full" 
              onPress={() => navigation.navigate('EditBooking', { booking })}
            >
              <Ionicons name="pencil" size={14} color="white" />
              <Text className="text-sm font-semibold font-dm text-white ml-1.5">Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const NavItem = ({ icon, text, active, navigation, targetScreen }) => (
    <TouchableOpacity 
      className="items-center" 
      onPress={() => navigation.navigate(targetScreen)}
    >
      <Ionicons 
        name={icon} 
        size={34} 
        color={active ? "#DC2626" : "#666"} 
      />
      <Text className={`text-sm ${active ? 'text-[#DC2626]' : 'text-[#0000008F]'} font-medium font-dm mt-1`}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pt-5 pb-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-gray-900 font-dm flex-1 text-center">My Bookings</Text>
        <View className="w-10" />
      </View>

      {/* Tabs */}
      <View className="flex-row px-5 gap-8 mb-5 border-b-2 border-gray-200">
        <TouchableOpacity 
          className={`pb-3 ${activeTab === 'past' ? 'border-b-2 border-red-600' : ''}`}
          onPress={() => setActiveTab('past')}
        >
          <Text className={`text-base ${activeTab === 'past' ? 'text-red-600 font-semibold' : 'text-gray-500'} font-dm`}>
            Past
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`pb-3 ${activeTab === 'upcoming' ? 'border-b-2 border-red-600' : ''}`}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text className={`text-base ${activeTab === 'upcoming' ? 'text-red-600 font-semibold' : 'text-gray-500'} font-dm`}>
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date and Filters */}
      <View className="flex-row justify-between items-center px-5 mb-5">
        <Text className="text-sm text-gray-600 font-dm">
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, Today
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity className="w-9 h-9 rounded-full border border-[#E8E8E8] items-center justify-center">
            <Ionicons name="search" size={18} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity className="w-9 h-9 rounded-full border border-[#E8E8E8] items-center justify-center" onPress={fetchBookings}>
            <Ionicons name="refresh" size={18} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bookings List */}
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#EF4444" />
            <Text className="text-base text-gray-600 font-dm mt-4">Loading bookings...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center py-10">
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text className="text-base text-gray-600 font-dm mt-4 text-center px-8">{error}</Text>
            <TouchableOpacity 
              className="bg-red-500 py-3 px-6 rounded-lg mt-4"
              onPress={fetchBookings}
            >
              <Text className="text-white font-dm font-medium">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : bookings.length === 0 ? (
          <View className="flex-1 items-center justify-center py-10">
            <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
            <Text className="text-base text-gray-600 font-dm mt-4">
              No {activeTab} bookings found
            </Text>
            <Text className="text-sm text-gray-400 font-dm mt-2 text-center px-8">
              {activeTab === 'upcoming' 
                ? 'Book a service to see it here' 
                : 'Your past bookings will appear here'}
            </Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </ScrollView>

       <Footer navigation={navigation} />
      
    </SafeAreaView>
  );
};

