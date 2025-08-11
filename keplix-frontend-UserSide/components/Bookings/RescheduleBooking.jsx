import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RescheduleBooking({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 5));
   const [modalVisible, setModalVisible] = useState(false); 

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

  const handleConfirm = () => {
    setModalVisible(false);
    navigation.navigate('RescheduledBooking', {
      date: `${selectedDate} June 2024`,
      time: selectedTime
    });
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
    const availableDates = [5, 9, 10, 11, 25, 26];
    return availableDates.includes(date);
  };

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.backcontainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.text}>Reschedule Booking</Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePreviousMonth}>
            <Ionicons name="chevron-back" style={styles.dropdownIcon} />
          </TouchableOpacity>
          <Text style={styles.monthText}>{formatMonthYear(currentDate)}</Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" style={styles.dropdownIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.daysRow}>
          {daysOfWeek.map((day, index) => (
            <Text key={index} style={styles.dayLabel}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {getCalendarDates().map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((date, dateIndex) => (
                <TouchableOpacity
                  key={dateIndex}
                  onPress={() => handleDateSelect(date)}
                  style={[
                    styles.dateCell,
                    date && isDateAvailable(date) && styles.availableDate,
                    date && selectedDate === date && styles.selectedDate,
                  ]}
                  disabled={!date}
                >
                  <Text
                    style={[
                      date && styles.dateText,
                      date && isDateAvailable(date) && styles.availableDateText,
                      date && selectedDate === date && styles.selectedDateText,
                    ]}
                  >
                    {date || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.timeSlotsContainer}>
        <Text style={styles.sectionTitle}>Available Time Slots:</Text>
        <View style={styles.timeGrid}>
          {timeSlots.map((time, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                selectedTime === time && styles.selectedTimeSlot,
              ]}
              onPress={() => handleTimeSelect(time)}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedTimeText,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

       <TouchableOpacity
        style={[
          styles.bookButton,
          selectedDate && selectedTime && styles.bookButtonActive,
        ]}
        disabled={!selectedDate || !selectedTime}
        onPress={handleProceed}
      >
        <Text style={styles.bookButtonText}>Reschedule</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>
              Are you sure you want to{'\n'}Reschedule your booking to
            </Text>
            <Text style={styles.modalDateTime}>
              26 June 2024
              <Text style={styles.modalTime}> at 6:00PM</Text>
              <Text style={styles.modalQuestion}> ?</Text>
            </Text>
            
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 30,
    borderColor: '#E2E2E2',
    borderWidth: 2,
    borderRadius: 50,
  },
  text: {
    fontSize: 24,
    marginRight: 30,
    color: "#000",
    fontFamily: 'DM',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    fontSize: 30,
    borderColor: '#E2E2E2',
    borderWidth: 2,
    borderRadius: 50,
    padding: 5,
  },
  backButton: {
    padding: 8,
  },
  calendarContainer: {
    padding: 16,
    borderColor: '#E2E2E2',
    borderWidth: 2,
    borderRadius: 24,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'DM',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'DM',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  dateCell: {
    marginLeft: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    fontFamily: 'DM',
  },
  availableDateText: {
    color: 'black',
    fontFamily: 'DM',
    fontWeight: 'bold'
  },
  selectedDate: {
    backgroundColor: 'red',
    borderRadius: 20,
  },
  selectedDateText: {
    color: '#fff',
  },
  timeSlotsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#0000008F',
    fontWeight: '500',
    fontFamily: 'DM',
    marginBottom: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    marginBottom:10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  selectedTimeSlot: {
    backgroundColor: 'red',
    borderColor: '#E2E2E2',
  },
  timeText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    fontFamily: 'DM',
  },
  selectedTimeText: {
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'DM',
  },
  bookButton: {
    marginTop:100,
    margin: 16,
    padding: 16,
    borderRadius: 70,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  bookButtonActive: {
    backgroundColor: 'red',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'DM',
  },
  dropdownIcon: {
    width:20,
    height: 30,
    fontSize: 18,
    lineHeight:26,
    color: "red",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 1.5,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  modalTitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 24,
    fontFamily: 'DM',
  },
  modalDateTime: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'DM',
  },
  modalTime: {
    color: '#000',
    fontFamily: 'DM',
  },
  modalQuestion: {
    color: '#666',
    fontFamily: 'DM',
  },
  confirmButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'DM',
  },
});

