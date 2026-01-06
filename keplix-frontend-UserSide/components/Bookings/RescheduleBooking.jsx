import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

export default function RescheduleBooking({ navigation, route }) {
  const [selectedDate, setSelectedDate] = useState('26'); 
  const [selectedTime, setSelectedTime] = useState('6:00PM');
  const [currentDate, setCurrentDate] = useState(new Date(2024, 5, 26)); 
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const booking = route?.params?.booking || {};

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

  const handleConfirm = async () => {
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      setModalVisible(false);
      navigation.navigate('BookingList'); // Navigate back or to success
    }, 1500);
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

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const timeSlots = ['10:30AM', '11:30AM', '2:00PM', '3:30PM', '4:30PM', '6:00PM'];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100"
        >
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 font-dm">Reschedule</Text>
        <View className="w-10" /> 
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Calendar Card */}
        <View className="bg-white border border-gray-100 rounded-[32px] p-5 my-4 shadow-sm">
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
            {daysOfWeek.map((day) => (
              <Text key={day} className="text-[10px] text-gray-400 font-bold w-9 text-center">
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
                    onPress={() => date && setSelectedDate(date.toString())}
                    disabled={!date}
                    className={`w-9 h-9 justify-center items-center rounded-full ${
                      date && selectedDate === date.toString() ? 'bg-red-600' : ''
                    }`}
                  >
                    <Text className={`text-sm font-dm ${
                      !date ? 'text-transparent' : 
                      selectedDate === date?.toString() ? 'text-white font-bold' : 'text-gray-900'
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
        <View className="mt-2">
          <Text className="text-sm font-bold text-gray-900 font-dm mb-4">Available Time Slots</Text>
          <View className="flex-row flex-wrap justify-between">
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => setSelectedTime(time)}
                className={`w-[31%] py-3 mb-3 rounded-2xl border items-center ${
                  selectedTime === time ? 'bg-red-600 border-red-600' : 'bg-white border-gray-100'
                }`}
              >
                <Text className={`text-[11px] font-bold ${
                  selectedTime === time ? 'text-white' : 'text-gray-900'
                }`}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View className="px-5 py-4 border-t border-gray-50">
        <TouchableOpacity
          className={`w-full py-4 rounded-2xl items-center shadow-lg ${
            selectedDate && selectedTime ? 'bg-red-600' : 'bg-gray-200'
          }`}
          disabled={!selectedDate || !selectedTime}
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-base font-bold">Reschedule Now</Text>
        </TouchableOpacity>
        <View className="w-20 h-1 bg-gray-200 rounded-full self-center mt-4" />
      </View>

      {/* Confirmation Modal */}
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="w-full bg-white rounded-[40px] p-8 items-center">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-6">
              <Ionicons name="calendar" size={32} color="#DC2626" />
            </View>
            
            <Text className="text-xl font-bold text-gray-900 text-center mb-2">Confirm Reschedule</Text>
            <Text className="text-gray-500 text-center leading-6 mb-8">
              Move your booking to{"\n"}
              <Text className="text-gray-900 font-bold">{selectedDate} June 2024</Text> at <Text className="text-gray-900 font-bold">{selectedTime}</Text>?
            </Text>

            <TouchableOpacity
              className="bg-red-600 py-4 rounded-2xl w-full mb-3"
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-bold">Yes, Confirm</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} className="py-2">
              <Text className="text-gray-400 font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}