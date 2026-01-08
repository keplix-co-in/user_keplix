import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ScreenTester({ navigation }) {
  const screens = [
    // SignUps
    {
      category: 'SignUps (Authentication)', screens: [
        { name: 'Login', icon: 'key', color: '#3B82F6' },
        { name: 'SignIn', icon: 'log-in', color: '#3B82F6' },
        { name: 'SignUp', icon: 'person-add', color: '#3B82F6' },
        { name: 'SignUpPhone', icon: 'phone-portrait', color: '#3B82F6' },
        { name: 'ForgotPassword', icon: 'help-circle', color: '#EF4444' },
        { name: 'ResetPassword', icon: 'lock-closed', color: '#F59E0B' },
        { name: 'PasswordChanged', icon: 'shield-checkmark', color: '#10B981' },
        { name: 'SendOtp', icon: 'mail', color: '#10B981' },
        { name: 'OtpVerified', icon: 'checkmark-circle', color: '#10B981' },
        { name: 'EmailVerify', icon: 'mail-open', color: '#10B981' },
      ]
    },

    // WelcomeSetUp
    {
      category: 'WelcomeSetUp', screens: [
        { name: 'WelcomeScreen', icon: 'hand-left', color: '#8B5CF6' },
        { name: 'WelcomeScreen2', icon: 'rocket', color: '#8B5CF6' },
      ]
    },

    // Homepage
    {
      category: 'Homepage', screens: [
        { name: 'Homepage', icon: 'home', color: '#06B6D4' },
        { name: 'SearchPage', icon: 'search', color: '#06B6D4' },
        { name: 'ProviderList', icon: 'list', color: '#06B6D4' },
        { name: 'ProviderDetails', icon: 'information-circle', color: '#06B6D4' },
        { name: 'HamburgerMenu', icon: 'menu', color: '#06B6D4' },
      ]
    },

    // Location
    {
      category: 'Location', screens: [
        { name: 'LocationPicker', icon: 'location', color: '#F59E0B' },
        { name: 'MapLocationPicker', icon: 'map', color: '#F59E0B' },
      ]
    },

    // Profile
    {
      category: 'Profile', screens: [
        { name: 'Profile', icon: 'person', color: '#EC4899' },
        { name: 'UserProfile', icon: 'person-circle', color: '#EC4899' },
        { name: 'ProfileVerify', icon: 'shield-checkmark', color: '#EC4899' },
        { name: 'Review', icon: 'star', color: '#EC4899' },
        { name: 'ReviewList', icon: 'list', color: '#EC4899' },
      ]
    },

    // Services
    {
      category: 'Services', screens: [
        { name: 'ServicesCard', icon: 'grid', color: '#10B981' },
        { name: 'SearchResult', icon: 'search', color: '#10B981' },
        { name: 'EngineRepairDetail', icon: 'construct', color: '#10B981' },
        { name: 'BookSlot', icon: 'calendar', color: '#10B981' },
        { name: 'ReviewPage', icon: 'create', color: '#10B981' },
        { name: 'BookingConfirmation', icon: 'checkmark-circle', color: '#10B981' },
        { name: 'Filters', icon: 'options', color: '#10B981' },
      ]
    },

    // PaymentMethods
    {
      category: 'PaymentMethods', screens: [
        { name: 'Payment1', icon: 'card', color: '#6366F1' },
        { name: 'Payment2', icon: 'card-outline', color: '#6366F1' },
        { name: 'Payment3', icon: 'wallet', color: '#6366F1' },
        { name: 'Payment4', icon: 'cash', color: '#6366F1' },
        { name: 'Payment5', icon: 'phone-portrait', color: '#6366F1' },
        { name: 'PaymentSuccess', icon: 'checkmark-circle', color: '#6366F1' },
        { name: 'PaymentConfirmation', icon: 'checkmark-done-circle', color: '#6366F1' },
      ]
    },

    // Bookings
    {
      category: 'Bookings', screens: [
        { name: 'BookingList', icon: 'list', color: '#8B5CF6' },
        { name: 'BookingDetails', icon: 'document-text', color: '#8B5CF6' },
        { name: 'EditBooking', icon: 'create', color: '#8B5CF6' },
        { name: 'CancelBooking', icon: 'close-circle', color: '#EF4444' },
        { name: 'RescheduleBooking', icon: 'time', color: '#8B5CF6' },
        { name: 'RescheduledBooking', icon: 'checkmark-circle', color: '#8B5CF6' },
      ]
    },

    // Support&Help
    {
      category: 'Support & Help', screens: [
        { name: 'Support', icon: 'help-buoy', color: '#14B8A6' },
        { name: 'FAQScreen', icon: 'help', color: '#14B8A6' },
        { name: 'Help', icon: 'help-circle', color: '#14B8A6' },
        { name: 'CustomerSupport', icon: 'headset', color: '#14B8A6' },
        { name: 'Feedback', icon: 'chatbox', color: '#14B8A6' },
        { name: 'ChatSupport', icon: 'chatbubbles', color: '#14B8A6' },
      ]
    },

    // UpdatePayment
    {
      category: 'UpdatePayment', screens: [
        { name: 'UpdatePayment', icon: 'refresh', color: '#F97316' },
        { name: 'UpdatePayment2', icon: 'card', color: '#F97316' },
        { name: 'UpdatePayment3', icon: 'wallet', color: '#F97316' },
        { name: 'ConfirmUpdate', icon: 'checkmark-done', color: '#F97316' },
      ]
    },

    // Security
    {
      category: 'Security', screens: [
        { name: 'Security', icon: 'shield', color: '#EF4444' },
        { name: 'ChangePassword', icon: 'key', color: '#EF4444' },
        { name: 'ChangePassword1', icon: 'lock-closed', color: '#EF4444' },
        { name: 'PasswordReseted', icon: 'checkmark-circle', color: '#EF4444' },
        { name: 'TwoFactorAuth', icon: 'phone-portrait', color: '#EF4444' },
        { name: 'TwoFactorAuthOFF', icon: 'lock-closed', color: '#EF4444' },
        { name: 'EnableTwoFactor', icon: 'lock-open', color: '#EF4444' },
        { name: 'TwoFactorConfirm', icon: 'checkmark-done', color: '#EF4444' },
        { name: 'AddEmail', icon: 'mail', color: '#EF4444' },
        { name: 'PrivacyPolicy', icon: 'document-lock', color: '#EF4444' },
      ]
    },

    // Notification
    {
      category: 'Notification', screens: [
        { name: 'Notification', icon: 'notifications', color: '#A855F7' },
      ]
    },
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
