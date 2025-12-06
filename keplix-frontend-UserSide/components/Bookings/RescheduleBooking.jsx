import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingsAPI } from '../../services/api';

export default function RescheduleBooking({ navigation, route }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get booking data from navigation params
  const booking = route?.params?.booking || null; 

  const formatMonthYear = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
    setSelectedDate(null); 
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
    setSelectedDate(null); 
  };

  const handleProceed = () => {
    if (selectedDate && selectedTime) {
      setModalVisible(true);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      
      // Get user ID from AsyncStorage
      const userData = await AsyncStorage.getItem('user_data');
      if (!userData) {
        Alert.alert('Error', 'User data not found. Please login again.');
        return;
      }
      
      const user = JSON.parse(userData);
      const userId = user.user_id || user.id;
      
      // Format date for API (YYYY-MM-DD)
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      // Format time for API (HH:MM:SS)
      const [time, period] = selectedTime.split(/(?=[AP]M)/);
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours);
      
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      const formattedTime = `${String(hours).padStart(2, '0')}:${minutes || '00'}:00`;
      
      // Update booking via API
      const updateData = {
        booking_date: formattedDate,
        booking_time: formattedTime,
        status: 'pending' // Set to pending for vendor to reconfirm
      };
      
      await bookingsAPI.updateBooking(userId, booking.id, updateData);
      
      setModalVisible(false);
      
      // Navigate to success screen
      navigation.navigate('RescheduledBooking', {
        booking: {
          ...booking,
          booking_date: formattedDate,
          booking_time: formattedTime
        }
      });
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to reschedule booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const dates = [];
    let currentWeek = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      currentWeek.push(null);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        dates.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add empty cells for remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      dates.push(currentWeek);
    }

    return dates;
  };

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Available time slots
  const timeSlots = [
    '10:30AM',
    '11:30AM',
    '2:00PM',
    '3:30PM',
    '4:30PM',
    '6:00PM'
  ];

  // Function to check if date is available (customize as needed)
  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    const selectedDateTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
    // Only allow future dates
    return selectedDateTime >= today.setHours(0, 0, 0, 0);
  };

  // Check if booking data exists
  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={['top']}>
        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="alert-circle-outline" size={40} color="#9CA3AF" />
        </View>
        <Text className="text-lg text-gray-900 font-semibold font-dm">No booking data available</Text>
        <TouchableOpacity 
          className="bg-red-600 py-3 px-6 rounded-full mt-6"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-dm font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Handle date selection
  const handleDateSelect = (date) => {
    if (date && isDateAvailable(date)) {
      setSelectedDate(date);
    }
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
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
        <Text className="text-2xl font-bold text-gray-900 font-dm">Reschedule Booking</Text>
        <View className="w-10" />
      </View>

      <View className="bg-white border border-[#E8E8E8] rounded-2xl p-5 mb-5">
        <View className="flex-row justify-between items-center mb-5">
          <TouchableOpacity 
            onPress={handlePreviousMonth}
            className="w-8 h-8 rounded-full border border-[#E8E8E8] items-center justify-center"
          >
            <Ionicons name="chevron-back" size={18} color="#DC2626" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-gray-900 font-dm">{formatMonthYear(currentDate)}</Text>
          <TouchableOpacity 
            onPress={handleNextMonth}
            className="w-8 h-8 rounded-full border border-[#E8E8E8] items-center justify-center"
          >
            <Ionicons name="chevron-forward" size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-around mb-3">
          {daysOfWeek.map((day, index) => (
            <Text key={index} className="text-xs text-gray-500 font-semibold font-dm w-10 text-center">
              {day.substring(0, 3)}
            </Text>
          ))}
        </View>

        <View className="rounded-xl">
          {getCalendarDates().map((week, weekIndex) => (
            <View key={weekIndex} className="flex-row justify-around">
              {week.map((date, dateIndex) => (
                <TouchableOpacity
                  key={dateIndex}
                  onPress={() => handleDateSelect(date)}
                  className={`w-10 h-10 justify-center items-center my-0.5 rounded-full ${
                    date && selectedDate === date ? 'bg-red-600' : ''
                  }`}
                  disabled={!date || !isDateAvailable(date)}
                >
                  <Text
                    className={`text-sm font-dm ${
                      !date ? '' : 
                      date && selectedDate === date ? 'text-white font-bold' : 
                      date && isDateAvailable(date) ? 'text-gray-900 font-medium' : 
                      'text-gray-300'
                    }`}
                  >
                    {date || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View className="px-1">
        <Text className="text-sm font-semibold font-dm mb-3 text-gray-900">Available Time Slots</Text>
        <View className="flex-row flex-wrap gap-2">
          {timeSlots.map((time, index) => (
            <TouchableOpacity
              key={index}
              className={`px-5 py-2.5 rounded-full border ${
                selectedTime === time ? 'bg-red-600 border-red-600' : 'bg-white border-[#E8E8E8]'
              }`}
              onPress={() => handleTimeSelect(time)}
            >
              <Text
                className={`text-sm font-semibold font-dm ${
                  selectedTime === time ? 'text-white' : 'text-gray-900'
                }`}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-1" />

      <TouchableOpacity
        className={`mx-1 mb-4 py-4 rounded-full items-center ${
          selectedDate && selectedTime ? 'bg-red-600' : 'bg-gray-300'
        }`}
        disabled={!selectedDate || !selectedTime}
        onPress={handleProceed}
      >
        <Text className="text-white text-base font-bold font-dm">Reschedule</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center px-6"
          onPress={() => setModalVisible(false)}
        >
          <Pressable className="w-full bg-white rounded-3xl p-6 items-center">
            <TouchableOpacity 
              className="absolute top-4 right-4 w-8 h-8 items-center justify-center z-10"
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            
            <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-5 mt-2">
              <Ionicons name="calendar" size={40} color="#DC2626" />
            </View>
            
            <Text className="text-lg font-bold text-gray-900 text-center mb-3 font-dm">
              Are you sure you want to{'\n'}reschedule your booking?
            </Text>
            
            <View className="bg-gray-50 border border-[#E8E8E8] rounded-2xl p-4 mb-6 w-full">
              <Text className="text-base text-gray-900 font-bold text-center font-dm">
                {selectedDate} {formatMonthYear(currentDate)} at {selectedTime}
              </Text>
            </View>
            
            <TouchableOpacity
              className="bg-red-600 py-4 rounded-full w-full mb-3"
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-bold text-center font-dm">Confirm</Text>
              )}
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>


    </SafeAreaView>
  );
}

