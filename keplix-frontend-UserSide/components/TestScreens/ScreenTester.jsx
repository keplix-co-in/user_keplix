import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ScreenTester({ navigation }) {
  const screens = [
    // Authentication Screens
    { category: 'Authentication', screens: [
      { name: 'SignIn', icon: 'log-in', color: '#3B82F6' },
      { name: 'SignUp', icon: 'person-add', color: '#3B82F6' },
      { name: 'SignUpPhone', icon: 'phone-portrait', color: '#3B82F6' },
      { name: 'Login', icon: 'key', color: '#3B82F6' },
      { name: 'ForgotPassword', icon: 'help-circle', color: '#EF4444' },
      { name: 'SendOtp', icon: 'mail', color: '#10B981' },
      { name: 'EmailVerify', icon: 'mail-open', color: '#10B981' },
      { name: 'OtpVerified', icon: 'checkmark-circle', color: '#10B981' },
      { name: 'ResetPassword', icon: 'lock-closed', color: '#F59E0B' },
      { name: 'PasswordChanged', icon: 'shield-checkmark', color: '#10B981' },
    ]},

    // Main Screens
    { category: 'Main Navigation', screens: [
      { name: 'Homepage', icon: 'home', color: '#8B5CF6' },
      { name: 'ServicesCard', icon: 'grid', color: '#8B5CF6' },
      { name: 'BookingList', icon: 'document-text', color: '#8B5CF6' },
      { name: 'Profile', icon: 'person', color: '#8B5CF6' },
    ]},

    // Homepage Related
    { category: 'Homepage & Search', screens: [
      { name: 'SearchPage', icon: 'search', color: '#06B6D4' },
      { name: 'ProviderList', icon: 'list', color: '#06B6D4' },
      { name: 'ProviderDetails', icon: 'information-circle', color: '#06B6D4' },
    ]},

    // Services
    { category: 'Services', screens: [
      { name: 'SearchResult', icon: 'search-circle', color: '#F59E0B' },
      { name: 'Filters', icon: 'funnel', color: '#F59E0B' },
      { name: 'EngineRepairDetail', icon: 'construct', color: '#F59E0B' },
      { name: 'BookSlot', icon: 'calendar', color: '#F59E0B' },
      { name: 'BookingConfirmation', icon: 'checkmark-done', color: '#10B981' },
      { name: 'ReviewPage', icon: 'star', color: '#F59E0B' },
    ]},

    // Bookings
    { category: 'Bookings', screens: [
      { name: 'BookingDetails', icon: 'document', color: '#EC4899' },
      { name: 'EditBooking', icon: 'create', color: '#EC4899' },
      { name: 'RescheduleBooking', icon: 'time', color: '#EC4899' },
      { name: 'RescheduledBooking', icon: 'checkmark-circle', color: '#10B981' },
      { name: 'CancelBooking', icon: 'close-circle', color: '#EF4444' },
    ]},

    // Profile & Reviews
    { category: 'Profile & Reviews', screens: [
      { name: 'ProfileVerify', icon: 'shield-checkmark', color: '#14B8A6' },
      { name: 'ReviewList', icon: 'star-half', color: '#F59E0B' },
      { name: 'Review', icon: 'chatbox-ellipses', color: '#F59E0B' },
    ]},

    // Payment
    { category: 'Payment Methods', screens: [
      { name: 'Payment1', icon: 'card', color: '#8B5CF6' },
      { name: 'Payment2', icon: 'card-outline', color: '#8B5CF6' },
      { name: 'Payment3', icon: 'wallet', color: '#8B5CF6' },
      { name: 'Payment4', icon: 'cash', color: '#8B5CF6' },
      { name: 'Payment5', icon: 'phone-portrait', color: '#8B5CF6' },
      { name: 'PaymentConfirmation', icon: 'checkmark-done-circle', color: '#10B981' },
      { name: 'PaymentSuccess', icon: 'checkmark-circle', color: '#10B981' },
    ]},

    // Update Payment & Welcome
    { category: 'Update Payment', screens: [
      { name: 'UpdatePayment', icon: 'refresh-circle', color: '#F59E0B' },
      { name: 'UpdatePayment2', icon: 'card', color: '#F59E0B' },
      { name: 'UpdatePayment3', icon: 'wallet-outline', color: '#F59E0B' },
      { name: 'ConfirmUpdate', icon: 'checkmark-done', color: '#10B981' },
    ]},

    // Welcome Setup
    { category: 'Welcome Setup', screens: [
      { name: 'WelcomeScreen', icon: 'hand-left', color: '#3B82F6' },
      { name: 'WelcomeScreen2', icon: 'rocket', color: '#3B82F6' },
    ]},

    // Security
    { category: 'Security', screens: [
      { name: 'Security', icon: 'shield', color: '#EF4444' },
      { name: 'ChangePassword', icon: 'key', color: '#EF4444' },
      { name: 'ChangePassword1', icon: 'lock-closed', color: '#EF4444' },
      { name: 'PasswordReseted', icon: 'shield-checkmark', color: '#10B981' },
      { name: 'TwoFactorAuth', icon: 'phone-portrait', color: '#EF4444' },
      { name: 'EnableTwoFactor', icon: 'lock-open', color: '#F59E0B' },
      { name: 'TwoFactorConfirm', icon: 'checkmark-done', color: '#10B981' },
      { name: 'TwoFactorAuthOFF', icon: 'lock-closed', color: '#6B7280' },
      { name: 'AddEmail', icon: 'mail-outline', color: '#3B82F6' },
    ]},

    // Support & Help
    { category: 'Support & Help', screens: [
      { name: 'Support', icon: 'help-buoy', color: '#06B6D4' },
      { name: 'Help', icon: 'help-circle', color: '#06B6D4' },
      { name: 'CustomerSupport', icon: 'headset', color: '#06B6D4' },
      { name: 'ChatSupport', icon: 'chatbubbles', color: '#06B6D4' },
      { name: 'FAQScreen', icon: 'help', color: '#06B6D4' },
      { name: 'Feedback', icon: 'chatbox', color: '#06B6D4' },
    ]},

    // Notifications
    { category: 'Notifications', screens: [
      { name: 'Notification', icon: 'notifications', color: '#8B5CF6' },
    ]},
  ];

  const renderScreenButton = (screen) => (
    <TouchableOpacity
      key={screen.name}
      onPress={() => navigation.navigate(screen.name)}
      className="m-2 p-4 rounded-xl items-center justify-center"
      style={{ 
        backgroundColor: screen.color,
        width: 100,
        height: 100,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}
    >
      <Ionicons name={screen.icon} size={32} color="white" />
      <Text className="text-white text-xs text-center mt-2 font-semibold" numberOfLines={2}>
        {screen.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="bg-blue-600 p-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="absolute left-4 top-4 z-10"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold text-center">
          Screen Tester
        </Text>
        <Text className="text-white text-sm text-center mt-1">
          Tap any screen to test it
        </Text>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {screens.map((category, idx) => (
          <View key={idx} className="mb-6">
            <View className="bg-gray-200 px-4 py-3 border-l-4 border-blue-600">
              <Text className="text-gray-800 text-lg font-bold">
                {category.category}
              </Text>
              <Text className="text-gray-600 text-xs">
                {category.screens.length} screens
              </Text>
            </View>
            <View className="flex-row flex-wrap px-2 py-2">
              {category.screens.map(renderScreenButton)}
            </View>
          </View>
        ))}

        {/* Summary */}
        <View className="mx-4 mb-4 p-4 bg-blue-100 rounded-lg border-2 border-blue-600">
          <Text className="text-blue-800 font-bold text-center text-lg">
            Total Screens: {screens.reduce((acc, cat) => acc + cat.screens.length, 0)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
