import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
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

  useEffect(() => {
    loadServiceData();
  }, []);

  const loadServiceData = async () => {
    try {
      setLoading(true);

      let data = route?.params?.serviceData;

      if (!data) {
        const savedService = await AsyncStorage.getItem('selected_service');
        if (savedService) {
          data = JSON.parse(savedService);
        }
      }

      setServiceData(data);

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
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleProceed = async () => {
    if (selectedDate && selectedTime) {
      try {
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        const formattedDate = `${selectedDate} ${monthName} ${year}`;

        const bookingData = {
          ...serviceData,
          bookingDate: formattedDate,
          bookingTime: selectedTime,
          bookingDateRaw: `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`,
          bookingTimeRaw: selectedTime,
        };

        await AsyncStorage.setItem('booking_draft', JSON.stringify(bookingData));

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

  const getCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dates = [];
    let week = Array(firstDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        dates.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      dates.push(week);
    }
    return dates;
  };

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const isDateAvailable = (date) => {
    if (!date) return false;

    const today = new Date();
    const selectedDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);

    if (selectedDateObj < today.setHours(0, 0, 0, 0)) {
      return false;
    }

    if (selectedDateObj.getDay() === 0) {
      return false;
    }

    return true;
  };

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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center" edges={['top']}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="mt-4 text-gray-500 font-dm">Loading booking slots...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text className="text-lg font-bold text-gray-900 font-dm absolute left-0 right-0 text-center -z-10">
          Book Appointment
        </Text>

        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Service Summary Card */}
        {serviceData && (
          <View className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-xs text-gray-500 font-dm uppercase mb-1">Booking for</Text>
                <Text className="text-lg font-bold font-dm text-gray-900" numberOfLines={1}>
                  {serviceData.serviceName || 'Service'}
                </Text>
                {serviceData.vendorName && (
                  <Text className="text-sm text-gray-600 font-dm mt-1">
                    {serviceData.vendorName}
                  </Text>
                )}
              </View>
              <View className="bg-white px-3 py-2 rounded-full">
                <Text className="text-red-600 font-bold font-dm">
                  ₹{serviceData.servicePrice?.toLocaleString('en-IN') || '0'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Calendar Card */}
        <View className="bg-white border border-gray-100 rounded-3xl p-5 mb-5 shadow-sm">
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={handlePreviousMonth} className="p-2">
              <Ionicons name="chevron-back" size={20} color="#DC2626" />
            </TouchableOpacity>

            <View className="flex-row items-center">
              <Ionicons name="calendar" size={18} color="#DC2626" />
              <Text className="text-base font-bold text-gray-900 font-dm ml-2">
                {formatMonthYear(currentDate)}
              </Text>
            </View>

            <TouchableOpacity onPress={handleNextMonth} className="p-2">
              <Ionicons name="chevron-forward" size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>

          {/* Days Header */}
          <View className="flex-row justify-between mb-4">
            {daysOfWeek.map((day, index) => (
              <Text key={index} className="text-xs text-gray-400 font-bold w-9 text-center">
                {day}
              </Text>
            ))}
          </View>

          {/* Dates Grid */}
          <View>
            {getCalendarDates().map((week, weekIdx) => (
              <View key={weekIdx} className="flex-row justify-between mb-2">
                {week.map((date, dateIdx) => (
                  <TouchableOpacity
                    key={dateIdx}
                    onPress={() => handleDateSelect(date)}
                    disabled={!date || !isDateAvailable(date)}
                    className={`w-9 h-9 justify-center items-center rounded-full ${date && selectedDate === date ? 'bg-red-600' : ''
                      }`}
                  >
                    <Text className={`text-sm font-dm ${!date ? 'text-transparent' :
                        !isDateAvailable(date) ? 'text-gray-300' :
                          selectedDate === date ? 'text-white font-bold' : 'text-gray-900'
                      }`}>
                      {date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Time Slots */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-900 font-dm mb-4">Available Time Slots</Text>
          <View className="flex-row flex-wrap justify-between">
            {availableSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedTime(time)}
                className={`w-[31%] py-3 mb-3 rounded-2xl border items-center ${selectedTime === time ? 'bg-red-600 border-red-600' : 'bg-white border-gray-100'
                  }`}
              >
                <Text className={`text-sm font-bold font-dm ${selectedTime === time ? 'text-white' : 'text-gray-900'
                  }`}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedDate && !selectedTime && (
            <View className="flex-row items-center mt-2">
              <Ionicons name="information-circle-outline" size={16} color="#DC2626" />
              <Text className="text-sm text-red-600 ml-1 font-dm">Please select a time slot</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View className="px-5 py-4 border-t border-gray-50">
        <TouchableOpacity
          className={`w-full py-4 rounded-2xl items-center shadow-lg ${selectedDate && selectedTime ? 'bg-red-600' : 'bg-gray-200'
            }`}
          disabled={!selectedDate || !selectedTime}
          onPress={handleProceed}
        >
          <Text className="text-white text-base font-bold font-dm">Continue to Review</Text>
        </TouchableOpacity>
        <View className="w-20 h-1 bg-gray-200 rounded-full self-center mt-4" />
      </View>
    </SafeAreaView>
  );
}
