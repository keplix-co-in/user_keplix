import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookSlot({ route, navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [serviceData, setServiceData] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get service data from route params or AsyncStorage
  useEffect(() => {
    loadServiceData();
  }, []);

  const loadServiceData = async () => {
    try {
      setLoading(true);
      
      // Try to get from route params first
      let data = route?.params?.serviceData;
      
      // If not in params, load from AsyncStorage
      if (!data) {
        const savedService = await AsyncStorage.getItem('selected_service');
        if (savedService) {
          data = JSON.parse(savedService);
        }
      }
      
      setServiceData(data);
      
      // Load available time slots (can be customized per service)
      const slots = [
        '10:30 AM',
        '11:30 AM',
        '2:00 PM',
        '3:30 PM',
        '4:30 PM',
        '6:00 PM'
      ];
      setAvailableSlots(slots);
      
    } catch (error) {
      console.error('Error loading service data:', error);
      Alert.alert('Error', 'Failed to load booking information.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleProceed = async () => {
    if (selectedDate && selectedTime) {
      try {
        // Format the date properly
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        const formattedDate = `${selectedDate} ${monthName} ${year}`;
        
        // Save booking details to AsyncStorage
        const bookingData = {
          ...serviceData,
          bookingDate: formattedDate,
          bookingTime: selectedTime,
          bookingDateRaw: `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`,
          bookingTimeRaw: selectedTime,
        };
        
        await AsyncStorage.setItem('booking_draft', JSON.stringify(bookingData));
        
        // Navigate to ReviewPage with booking details
        navigation.navigate('ReviewPage', {
          serviceData: serviceData,
          date: formattedDate,
          time: selectedTime,
          dateRaw: bookingData.bookingDateRaw,
        });
      } catch (error) {
        console.error('Error saving booking details:', error);
        Alert.alert('Error', 'Failed to proceed with booking. Please try again.');
      }
    } else {
      Alert.alert('Incomplete Selection', 'Please select both date and time slot.');
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
    setSelectedDate(null); 
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

  // Function to check if date is available (customize as needed)
  const isDateAvailable = (date) => {
    if (!date) return false;
    
    const today = new Date();
    const selectedDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
    
    // Don't allow past dates
    if (selectedDateObj < today.setHours(0, 0, 0, 0)) {
      return false;
    }
    
    // Don't allow Sundays (day 0)
    if (selectedDateObj.getDay() === 0) {
      return false;
    }
    
    // All other future dates are available
    return true;
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (date && isDateAvailable(date)) {
      setSelectedDate(date);
    } else if (date && !isDateAvailable(date)) {
      const selectedDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
      if (selectedDateObj < new Date().setHours(0, 0, 0, 0)) {
        Alert.alert('Invalid Date', 'Please select a future date.');
      } else if (selectedDateObj.getDay() === 0) {
        Alert.alert('Closed', 'Service not available on Sundays.');
      }
    }
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center" edges={['top']}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="mt-4 text-gray-500 font-dm">Loading booking slots...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-5" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View className="flex-row items-center mb-5">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-semibold font-['DM']">Book Appointment</Text>
      </View>

      <View className="p-5 bg-white border border-[#E8E8E8] rounded-2xl mb-5">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-lg font-bold text-gray-900 font-dm">{formatMonthYear(currentDate)}</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity 
              onPress={handlePreviousMonth}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={18} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleNextMonth}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="chevron-forward" size={18} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-around mb-3">
          {daysOfWeek.map((day, index) => (
            <Text key={index} className="text-xs text-gray-500 font-semibold font-dm w-10 text-center">
              {day.charAt(0)}
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
                  className={`w-10 h-10 justify-center items-center my-1 ${date && selectedDate === date ? 'bg-red-600 rounded-full' : ''}`}
                  disabled={!date}
                >
                  <Text
                    className={`text-sm font-dm ${!date ? '' : date && isDateAvailable(date) ? 'text-gray-900 font-semibold' : 'text-gray-300'} ${date && selectedDate === date ? 'text-white font-bold' : ''}`}
                  >
                    {date || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Service Info */}
      {serviceData && (
        <View className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl">
          <Text className="text-xs text-[#999] font-['DM'] uppercase mb-1">Booking for</Text>
          <Text className="text-lg font-semibold font-['DM'] text-gray-900">{serviceData.serviceName || 'Service'}</Text>
          {serviceData.vendorName && (
            <Text className="text-sm text-[#666] font-['DM'] mt-1">Provider: {serviceData.vendorName}</Text>
          )}
        </View>
      )}

      <View className="px-1">
        <Text className="text-base font-semibold font-['DM'] mb-3 text-gray-900">Available Time Slots</Text>
        <View className="flex-row flex-wrap gap-2">
          {availableSlots.map((time, index) => (
            <TouchableOpacity
              key={index}
              className={`px-5 py-3 rounded-full border ${selectedTime === time ? 'bg-red-600 border-red-600' : 'bg-white border-[#E8E8E8]'}`}
              onPress={() => handleTimeSelect(time)}
            >
              <Text
                className={`text-sm font-medium font-['DM'] ${selectedTime === time ? 'text-white' : 'text-gray-700'}`}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedDate && !selectedTime && (
          <Text className="text-sm text-red-500 mt-3 font-['DM']">⚠️ Please select a time slot</Text>
        )}
      </View>

      <View className="flex-1" />

      <TouchableOpacity
        className={`mx-4 mb-4 py-4 rounded-full items-center ${selectedDate && selectedTime ? 'bg-red-600' : 'bg-gray-300'}`}
        disabled={!selectedDate || !selectedTime}
        onPress={handleProceed}
      >
        <Text className="text-white text-base font-semibold font-['DM']">Continue to Review</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

