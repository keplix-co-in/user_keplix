import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { feedbackAPI, reviewsAPI } from '../../services/api';

export default function FeedbackScreen({ navigation, route }) {
  const { booking } = route.params || {};
  const [rating, setRating] = useState(5); // All stars full on load
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const improvementTags = [
    'Overall Service',
    'Customer Support',
    'Speed & Efficiency',
    'Repair Quality',
    'Pickup & Delivery Service',
  ];
  const [selectedTags, setSelectedTags] = useState([]); // No tags selected initially

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user_data');
      if (userDataString) {
        setUserData(JSON.parse(userDataString));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!userData?.id) {
      Alert.alert('Authentication Required', 'Please login to submit feedback.');
      navigation.navigate('SignIn');
      return;
    }

    if (!feedbackText.trim() && selectedTags.length === 0) {
      Alert.alert('Incomplete Feedback', 'Please provide feedback text or select improvement areas.');
      return;
    }

    setLoading(true);

    try {
      const feedbackData = {
        user_id: userData.id,
        rating: rating,
        comment: feedbackText.trim(),
        improvement_areas: selectedTags.join(', '),
        feedback_type: 'general',
      };

      await feedbackAPI.createFeedback(feedbackData);

      Alert.alert(
        'Success',
        'Thank you for your feedback! We appreciate your input.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setRating(5);
              setFeedbackText('');
              setSelectedTags([]);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Submit feedback error:', error);

      if (error.response?.data?.error) {
        Alert.alert('Error', error.response.data.error);
      } else if (error.message === 'Network Error') {
        Alert.alert('Network Error', 'Please check your internet connection and ensure the backend server is running.');
      } else {
        Alert.alert('Error', 'Failed to submit feedback. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mt-5 mb-6">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
          >
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 font-dm">Feedback</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-base text-gray-600 font-dm">Skip →</Text>
          </TouchableOpacity>
        </View>

        {/* Service Info Card */}
        {booking && (
          <View className="bg-white border border-[#E8E8E8] rounded-2xl p-4 mb-6">
            <View className="flex-row items-start">
              <View className="mr-3">
                <View className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
                  {/* Service Image Placeholder */}
                  <View className="w-full h-full bg-red-600 items-center justify-center">
                    <MaterialCommunityIcons name="car-wrench" size={32} color="white" />
                  </View>
                </View>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 font-dm mb-1">
                  {booking.service?.vendor_name || 'Dwarka mor service'}
                </Text>
                <Text className="text-sm text-gray-500 font-dm mb-1">
                  {booking.service?.location || 'B1-41, Chandan park,'}
                </Text>
                <Text className="text-sm text-gray-500 font-dm mb-2">
                  {booking.service?.area || 'Dwarka mor'} - {booking.service?.pincode || '110059'}
                </Text>
                <Text className="text-sm text-gray-700 font-dm">
                  <Text className="font-semibold">Service:</Text> {booking.service?.name || 'Engine Repair'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Rating Section */}
        <Text className="text-base font-bold text-gray-900 mb-2 font-dm">Rating:</Text>
        <View className="flex-row mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)} className="mr-2">
              <Ionicons
                name={i <= rating ? 'star' : 'star-outline'}
                size={40}
                color={i <= rating ? '#DC2626' : '#DC2626'}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-sm text-gray-600 font-dm mb-6">How satisfied was our service?</Text>

        {/* Feedback Input */}
        <TextInput
          className="border border-[#E8E8E8] rounded-2xl px-4 py-4 text-base bg-gray-50 font-dm min-h-[120px]"
          placeholder="Type here...."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          value={feedbackText}
          onChangeText={setFeedbackText}
        />
      </ScrollView>

      <View className="px-6 pb-6">
        <TouchableOpacity 
          className={`rounded-full py-4 items-center ${loading ? 'bg-gray-400' : 'bg-red-600'}`}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-bold font-dm">Publish review</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
