import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';
import * as ImagePicker from 'expo-image-picker';

export default function UserProfile({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
    requestImagePermissions();
  }, []);

  const requestImagePermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera roll permissions to update your profile picture.');
    }
  };

  const loadUserProfile = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user_data');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setName(userData.name || userData.username || '');
        setEmail(userData.email || '');
        setContactNumber(userData.phone_number || '');
        setProfilePicture(userData.profile_picture || null);
      }

      // Fetch latest from backend
      const response = await authAPI.getProfile();
      if (response.data) {
        setName(response.data.name || response.data.username || '');
        setEmail(response.data.email || '');
        setContactNumber(response.data.phone_number || '');
        setProfilePicture(response.data.profile_picture || null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSaveChanges = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        name: name.trim(),
        email: email.trim(),
        phone_number: contactNumber.trim(),
        address: '', // Optional field
      };

      // If profile picture is a local URI (not from server), handle upload
      if (profilePicture && profilePicture.startsWith('file://')) {
        // Note: For actual image upload, you'd need to use FormData
        // For now, we'll skip the image upload and just update other fields
        // console.log('Image upload would happen here');
        // const formData = new FormData();
        // formData.append('profile_picture', {
        //   uri: profilePicture,
        //   name: 'profile.jpg',
        //   type: 'image/jpeg',
        // });
        // await authAPI.updateProfilePicture(formData);
      }

      const response = await authAPI.updateProfile(updateData);
      
      if (response.data) {
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
        navigation.navigate('ProfileVerify');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Update Failed',
        error.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="mt-4 text-base text-[#666] font-['DM']">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{flex: 1, padding: 20, backgroundColor: '#fff'}}>
      <View className="flex-row items-center mb-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} size={30} color="#000" style={{borderColor: '#E2E2E2', borderWidth: 2, borderRadius: 50, padding: 5}} />
        </TouchableOpacity>
      </View>

      <View className="items-center mb-5">
        <View className="relative w-[100px] h-[100px] rounded-2xl overflow-hidden" style={{shadowColor: '#000', shadowOffset: {width: 4, height: 4}, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8, backgroundColor: '#fff'}}>
          <Image
            source={profilePicture ? { uri: profilePicture } : require("../../assets/images/3.jpeg")}
            className="w-full h-full rounded-2xl border-4 border-white"
          />
          <TouchableOpacity
            className="absolute bottom-2.5 right-2.5 w-[30px] h-[30px] rounded-[15px] bg-[#4F4F4F59] justify-center items-center"
            style={{shadowColor: '#000', shadowOffset: {width: 2, height: 2}, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5}}
            onPress={pickImage}
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={pickImage}>
          <View className="flex-row items-center mt-2.5">
            <Entypo name="camera" size={20} color="#DC2626" />
            <Text className="text-base text-[#DC2626] font-['DM'] font-medium ml-1">Edit Profile</Text>
          </View>
        </TouchableOpacity>
      </View>


      <View className="mb-5">
        <Text className="text-base text-[#0000008F] font-['DM'] font-medium mb-1">Name</Text>
        <View className="flex-row items-center bg-white rounded-2xl border-2 border-[#E2E2E2] mb-4 px-4">
          <TextInput
            className="flex-1 text-xl text-[#0000008F] font-['DM'] font-medium bg-transparent py-2.5"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#0000008F"
          />
          <MaterialIcons name="edit" size={20} color="#0000008F" style={{marginLeft: 10}} />
        </View>

        <Text className="text-base text-[#0000008F] font-['DM'] font-medium mb-1">Phone Number</Text>
        <View className="flex-row items-center bg-white rounded-2xl border-2 border-[#E2E2E2] mb-4 px-4">
          <TextInput
            className="flex-1 text-xl text-[#0000008F] font-['DM'] font-medium bg-transparent py-2.5"
            value={contactNumber}
            keyboardType="phone-pad"
            onChangeText={setContactNumber}
            placeholder="Enter phone number"
            placeholderTextColor="#0000008F"
          />
          <MaterialIcons name="edit" size={20} color="#0000008F" style={{marginLeft: 10}} />
        </View>

        <Text className="text-base text-[#0000008F] font-['DM'] font-medium mb-1">Email</Text>
        <View className="flex-row items-center bg-white rounded-2xl border-2 border-[#E2E2E2] mb-4 px-4">
          <TextInput
            className="flex-1 text-xl text-[#0000008F] font-['DM'] font-medium bg-transparent py-2.5"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter email"
            placeholderTextColor="#0000008F"
          />
          <MaterialIcons name="edit" size={20} color="#0000008F" style={{marginLeft: 10}} />
        </View>
      </View>


      <View className="flex-1">
        <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 80}}>
        </ScrollView>
        <TouchableOpacity 
          className="absolute bottom-0 left-0 right-0 bg-[#DC2626] p-4 items-center rounded-[70px]" 
          onPress={handleSaveChanges}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-xl text-white font-['DM'] font-medium">Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};
