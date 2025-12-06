import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reviewsAPI } from '../../services/api';

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <View className="flex-row items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={32}
            color="#DC2626"
            style={{marginRight: 8}}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function Review({ navigation, route }) {
  const [rating, setRating] = useState(3);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Get booking/service data from route params
  const bookingData = route?.params?.booking || {};
  const vendorData = route?.params?.vendor || {};
  const serviceData = route?.params?.service || {};

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user_data');
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert('Validation Error', 'Please write your feedback before submitting');
      return;
    }

    if (!userData?.id) {
      Alert.alert('Error', 'User data not found. Please login again.');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        user: userData.id,
        vendor: vendorData.id || bookingData.vendor_id,
        booking: bookingData.id,
        rating: rating,
        comment: feedback.trim(),
      };

      const response = await reviewsAPI.createReview(reviewData);
      
      if (response.data) {
        Alert.alert(
          'Success',
          'Your review has been published successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('BookingList'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert(
        'Submission Failed',
        error.response?.data?.message || 'Failed to publish review. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View className="flex-row justify-between items-center p-4 pt-5">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full border border-[#E2E2E2] justify-center items-center"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center py-2 px-4 rounded-full bg-[#F5F5F5]"
          onPress={() => navigation.navigate('BookingList')}
        >
          <Text className="text-base mr-1 text-black">Skip</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <Text className="text-2xl font-semibold text-black font-['DM']">Your Feedback</Text>
        <Text className="text-base text-[#666] font-['DM']">will matter a lot.</Text>
      </View>

      <View className="m-4 p-4 bg-white rounded-2xl border border-[#E2E2E2]">
        <View className="flex-row justify-between mb-5">
          <View className="flex-1">
            <Text className="text-lg font-medium mb-1 font-['DM']">
              {vendorData.business_name || bookingData.vendor_name || 'Service Provider'}
            </Text>
            <Text className="text-sm text-[#666] mb-2 font-['DM']">
              {vendorData.address || bookingData.address || 'Location not specified'}
            </Text>
            
            <View className="flex-row items-center">
              <Text className="text-sm text-[#666] font-['DM']">Service: </Text>
              <Text className="text-sm font-medium text-black font-['DM']">
                {serviceData.name || bookingData.service_name || 'Service'}
              </Text>
            </View>
          </View>
          
          <Image
            source={
              vendorData.profile_picture 
                ? { uri: vendorData.profile_picture }
                : require('../../assets/images/p1.png')
            }
            className="w-[100px] h-[100px] rounded-lg bg-[#f0f0f0]"
          />
        </View>

        <View className="mb-5">
          <Text className="text-sm text-[#666] mb-2 font-['DM']">Rating:</Text>
          <StarRating rating={rating} onRatingChange={setRating} />
        </View>

        <View className="mb-5">
          <Text className="text-sm text-[#666] mb-2 font-['DM']">How satisfied was our service?</Text>
          <TextInput
            className="bg-[#F5F5F5] rounded-lg p-3 h-[120px] text-base font-['DM']"
            placeholder="Type here...."
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            placeholderTextColor="#666"
            textAlignVertical="top"
          />
        </View>
      </View>

      <TouchableOpacity 
        className="m-4 p-4 bg-[#DC2626] rounded-[25px] items-center"
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-medium font-['DM']">Publish Review</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
