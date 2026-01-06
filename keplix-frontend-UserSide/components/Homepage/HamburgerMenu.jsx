import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuItem = ({ icon, iconLib = 'Ionicons', title, onPress, color = '#374151' }) => {
  const IconComponent = iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;

  return (
    <TouchableOpacity
      className="flex-row items-center px-5 py-4 border-b border-gray-100"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
        <IconComponent name={icon} size={20} color={color} />
      </View>
      <Text className="flex-1 text-base font-dm text-gray-900">{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default function HamburgerMenu({ navigation }) {
  const handleAboutUs = () => {
    Alert.alert(
      'About Us',
      'Keplix - Your trusted car service platform. We connect you with the best service providers in your area.',
      [{ text: 'OK' }]
    );
  };

  const handleInviteFriend = () => {
    Alert.alert(
      'Invite a Friend',
      'Share Keplix with your friends and earn rewards!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => console.log('Share pressed') }
      ]
    );
  };

  const handleHelpSupport = () => {
    navigation.navigate('Support');
  };

  const handleReportIssue = () => {
    navigation.navigate('Feedback');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleNotifications = () => {
    navigation.navigate('Notification');
  };

  const handleSecurity = () => {
    navigation.navigate('Security');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user_data');
              await AsyncStorage.removeItem('auth_token');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error logging out:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
        >
          <Ionicons name="close" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text className="text-lg font-bold text-gray-900 font-dm">Menu</Text>

        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Main Menu Section */}
        <View className="mt-2">
          <MenuItem
            icon="information-circle-outline"
            title="About Us"
            onPress={handleAboutUs}
            color="#DC2626"
          />

          <MenuItem
            icon="person-add-outline"
            title="Invite a Friend"
            onPress={handleInviteFriend}
            color="#10B981"
          />

          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={handleHelpSupport}
            color="#3B82F6"
          />

          <MenuItem
            icon="flag-outline"
            title="Report an Issue"
            onPress={handleReportIssue}
            color="#F59E0B"
          />
        </View>

        {/* Account Section */}
        <View className="mt-4">
          <Text className="px-5 py-2 text-xs font-semibold text-gray-500 uppercase font-dm">
            Account
          </Text>

          <MenuItem
            icon="person-outline"
            title="My Profile"
            onPress={handleProfile}
          />

          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            onPress={handleNotifications}
          />

          <MenuItem
            icon="shield-checkmark-outline"
            title="Security"
            onPress={handleSecurity}
          />
        </View>

        {/* Logout */}
        <View className="mt-6 px-5 pb-6">
          <TouchableOpacity
            className="bg-red-50 py-4 rounded-2xl flex-row items-center justify-center border border-red-100"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text className="text-red-600 font-bold font-dm ml-2">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="items-center pb-8 px-5">
          <Text className="text-xs text-gray-400 font-dm">Keplix v1.0.0</Text>
          <Text className="text-xs text-gray-400 font-dm mt-1">© 2024 Keplix. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
