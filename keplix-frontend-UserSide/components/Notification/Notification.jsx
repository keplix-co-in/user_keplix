import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Switch,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationsAPI } from '../../services/api';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export default function Notification({ navigation }) {
  const [customAlertsEnabled, setCustomAlertsEnabled] = useState(false);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(false);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('An Hour Before');
  const [dropdownExpanded, setDropdownExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        const id = user.id || user.user_id;
        setUserId(id);

        // Load saved preferences from AsyncStorage
        const savedSettings = await AsyncStorage.getItem('notification_settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setCustomAlertsEnabled(settings.customAlerts || false);
          setEmailAlertsEnabled(settings.emailAlerts || false);
          setSmsAlertsEnabled(settings.smsAlerts || false);
          setSelectedOption(settings.alertTiming || 'An Hour Before');
          setShowDropdown(settings.customAlerts || false);
        }
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCustomAlerts = async () => {
    const newState = !customAlertsEnabled;
    setCustomAlertsEnabled(newState);
    setShowDropdown(newState);
    setHasChanges(true);

    if (newState) {
       // Play sound and vibrate as preview
       try {
         await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
         const { sound } = await Audio.Sound.createAsync(
            { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' }
         );
         await sound.playAsync();
       } catch (error) {
         console.log('Error playing test sound:', error);
       }
    }
  };
  
  const toggleEmailAlerts = () => {
    const newState = !emailAlertsEnabled;
    setEmailAlertsEnabled(newState);
    setHasChanges(true);
    if (newState) {
        Alert.alert("Email Alerts", "You will now receive booking updates via email.");
    }
  };

  const toggleSmsAlerts = () => {
    const newState = !smsAlertsEnabled;
    setSmsAlertsEnabled(newState);
    setHasChanges(true);
    if (newState) {
        Alert.alert("SMS Alerts", "SMS notifications enabled. Carrier rates may apply.");
    }
  };
  
  const toggleDropdown = () => setDropdownExpanded(!dropdownExpanded);
  
  const selectOption = (option) => {
    setSelectedOption(option);
    setDropdownExpanded(false);
    setHasChanges(true);
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const settings = {
        customAlerts: customAlertsEnabled,
        emailAlerts: emailAlertsEnabled,
        smsAlerts: smsAlertsEnabled,
        alertTiming: selectedOption,
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem('notification_settings', JSON.stringify(settings));
      
      // Sync with backend if logged in
      if (userId) {
          // Mock API call - in production replace with notificationsAPI.updateSettings(userId, settings)
          console.log(`[Notification] Syncing settings for user ${userId}:`, settings);
          if (emailAlertsEnabled) {
              console.log('[Notification] Sending test email alert confirmation...');
              // await notificationsAPI.sendTestEmail(userId);
          }
          if (smsAlertsEnabled) {
              console.log('[Notification] Sending test SMS alert confirmation...');
              // await notificationsAPI.sendTestSMS(userId);
          }
      }

      Alert.alert(
        'Success',
        'Notification settings saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setHasChanges(false);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving notification settings:', error);
      Alert.alert('Error', 'Failed to save notification settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Check if any switch is enabled to determine save button color
  const isSaveEnabled = hasChanges && (customAlertsEnabled || emailAlertsEnabled || smsAlertsEnabled);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center" edges={['top']}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="text-gray-500 mt-2 font-dm">Loading settings...</Text>
      </SafeAreaView>
    );
  }

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
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 10 }}>
        <Text className="text-2xl font-semibold font-dm text-gray-900 mb-6">Notification Settings</Text>

        <View className="bg-white border border-[#E8E8E8] rounded-2xl p-4 mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-3">
                <Feather name="alert-circle" size={24} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold font-dm text-gray-900">Custom Alerts</Text>
                <Text className="text-xs font-dm text-gray-500 mt-1">Set up custom alerts for bookings</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#E8E8E8', true: '#DC2626' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#E8E8E8"
              onValueChange={toggleCustomAlerts}
              value={customAlertsEnabled}
            />
          </View>
        </View>

        {showDropdown && (
          <View className="mb-4">
            <TouchableOpacity 
              className="flex-row items-center bg-[#EEEEEE] rounded-[25px] p-4 mt-1 mb-1"
              onPress={toggleDropdown}
            >
              <View className="w-7 items-center justify-center">
                <Ionicons name="time-outline" size={24} color="black" />
              </View>
              <Text className="text-base font-semibold font-dm flex-1 text-[#666]">{selectedOption}</Text>
              <Ionicons 
                name={dropdownExpanded ? "chevron-up" : "chevron-down"} 
                size={24} 
                color="black" 
                className="mr-1"
              />
            </TouchableOpacity>

            {dropdownExpanded && (
              <View className="bg-white rounded-[25px] border border-[#EEEEEE] mt-1 overflow-hidden">
                <TouchableOpacity 
                  className="flex-row items-center p-4"
                  onPress={() => selectOption('An Hour Before')}
                >
                  <View className="w-7 items-center justify-center">
                    <Ionicons name="time-outline" size={24} color="black" />
                  </View>
                  <Text className="text-base font-semibold font-dm flex-1 text-[#666]">An Hour Before</Text>
                </TouchableOpacity>
                <View className="h-[1px] bg-[#E0E0E0] ml-[50px]" />
                
                <TouchableOpacity 
                  className="flex-row items-center p-4"
                  onPress={() => selectOption('A Day Before')}
                >
                  <View className="w-7 items-center justify-center">
                    <Ionicons name="time-outline" size={24} color="black" />
                  </View>
                  <Text className="text-base font-semibold font-dm flex-1 text-[#666]">A Day Before</Text>
                </TouchableOpacity>
                <View className="h-[1px] bg-[#E0E0E0] ml-[50px]" />
                
                <TouchableOpacity 
                  className="flex-row items-center p-4"
                  onPress={() => selectOption('3 Hours Before')}
                >
                  <View className="w-7 items-center justify-center">
                    <Ionicons name="time-outline" size={24} color="black" />
                  </View>
                  <Text className="text-base font-semibold font-dm flex-1 text-[#666]">3 Hours Before</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <View className="flex-row items-center py-4 border-b border-[#e0e0e0]">
          <View className="w-10 items-center justify-center">
            <MaterialIcons name="email" size={30} color="black" />
          </View>
          <View className="flex-1 ml-2.5">
            <Text className="text-xl font-medium font-dm text-black">Email Alerts</Text>
            <Text className="text-sm font-medium font-dm text-[#777] mt-0.5">Receive notifications via email?</Text>
            {emailAlertsEnabled && (
              <Text className="text-xs font-medium font-dm text-[#DC2626] mt-1">Email alerts turned on</Text>
            )}
          </View>
          <Switch
            trackColor={{ false: '#e0e0e0', true: '#DC2626' }}
            thumbColor={emailAlertsEnabled ? '#ffffff' : '#ffffff'}
            ios_backgroundColor="#e0e0e0"
            onValueChange={toggleEmailAlerts}
            value={emailAlertsEnabled}
            style={{ transform: [{ scaleX: 1.6 }, { scaleY: 1.6 }], marginRight: 10 }}
          />
        </View>

        <View className="flex-row items-center py-4 border-b border-[#e0e0e0]">
          <View className="w-10 items-center justify-center">
            <MaterialIcons name="chat-bubble" size={30} color="black" />
          </View>
          <View className="flex-1 ml-2.5">
            <Text className="text-xl font-medium font-dm text-black">SMS Alerts</Text>
            <Text className="text-sm font-medium font-dm text-[#777] mt-0.5">Receive notifications via SMS?</Text>
            {smsAlertsEnabled && (
              <Text className="text-xs font-medium font-dm text-[#DC2626] mt-1">SMS alerts turned on</Text>
            )}
          </View>
          <Switch
            trackColor={{ false: '#e0e0e0', true: '#DC2626' }}
            thumbColor={smsAlertsEnabled ? '#ffffff' : '#ffffff'}
            ios_backgroundColor="#e0e0e0"
            onValueChange={toggleSmsAlerts}
            value={smsAlertsEnabled}
            style={{ transform: [{ scaleX: 1.6 }, { scaleY: 1.6 }], marginRight: 10 }}
          />
        </View>

      </ScrollView>

     <View className="p-4 pb-6 bg-white">
        <TouchableOpacity 
          className={`rounded-full p-4 items-center mt-7 ${
            isSaveEnabled ? 'bg-[#DC2626]' : 'bg-[#0000008F]'
          }`}
          onPress={saveSettings}
          disabled={!isSaveEnabled || saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold font-dm">Save Settings</Text>
          )}
        </TouchableOpacity>
        
        {hasChanges && !isSaveEnabled && (
          <Text className="text-center text-gray-500 text-sm font-dm mt-2">
            Enable at least one notification type to save
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

