import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import locationService from '../../services/locationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LocationPermissionScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const requestLocationPermission = async () => {
    setLoading(true);

    try {
      // Request location permission using the service
      const { status, location } = await locationService.requestPermission();
      
      if (status === "granted") {
        console.log("Location permission granted");
        
        if (location) {
          console.log("Location:", location);
          
          // Get address from coordinates
          const address = await locationService.getAddressFromCoordinates(
            location.latitude,
            location.longitude
          );

          // Save the location and address
          await locationService.saveLocation(location, address);

          if (address) {
            console.log("Address:", address);
          }

          Alert.alert(
            'Success',
            'Location access granted! You can now find services near you.',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate("Homepage"),
              },
            ]
          );
        } else {
          // Permission granted but couldn't get location
          Alert.alert(
            'Location Unavailable',
            'Permission granted but couldn\'t get your location. You can try again later.',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate("Homepage"),
              },
            ]
          );
        }
      } else {
        console.log("Location permission denied by user");
        
        Alert.alert(
          'Permission Denied',
          'You can enable location access later from Settings to find services near you.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate("Homepage"),
            },
          ]
        );
      }
    } catch (error) {
      console.log("Error requesting location permission:", error);
      Alert.alert(
        'Error',
        'Unable to access location. You can try again later from Settings.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate("Homepage"),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLater = async () => {
    console.log("Location permission skipped");
    try {
      await AsyncStorage.setItem('location_permission', 'skipped');
      await AsyncStorage.setItem('location_permission_asked', 'true');
    } catch (error) {
      console.error('Error saving location preference:', error);
    }
    navigation.navigate("Homepage");
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-black">
      {/* Back Button */}
      <View className="flex-row items-center mb-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} size={30} color="white" className="border-2 border-[#E2E2E2] rounded-full p-[5px]" />
        </TouchableOpacity>
      </View>

      {/* Image/Icon Placeholder */}
      <View className="justify-center items-center flex-1">
        <View className="w-[80%] h-[60%] bg-[#1a1a1a] justify-center items-center rounded-lg mb-5 border-2 border-[#333]">
          <Ionicons name="location" size={120} color="#DC2626" />
          <Ionicons name="navigate-circle" size={80} color="#red" style={{ position: 'absolute', bottom: 20 }} />
        </View>
      </View>

      <View className="mb-[30px] self-start ml-2.5">
        <Text className="text-white font-['DM'] text-[32px] font-medium">Keplix Wants To</Text>
        <Text className="text-white font-['DM'] text-[32px] font-medium">Know Your Location</Text>
        <View className="w-[100px] h-1 bg-[#DC2626] mt-2 mb-3" />
        <Text className="text-gray-400 font-['DM'] text-base">
          We'll use your location to find the nearest service providers and give you accurate distance estimates.
        </Text>
      </View>

      <View className="h-[120px] flex-col mt-2.5 justify-between mb-5 gap-[15px]">
        <TouchableOpacity 
          className="flex-1 bg-white border-2 border-[#E2E2E2] rounded-[25px] py-3 items-center mr-2.5" 
          onPress={handleLater}
          disabled={loading}
        >
          <Text className="text-black font-medium font-['DM'] text-xl">Do It Later</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 rounded-[25px] py-3 items-center ${loading ? 'bg-red-400' : 'bg-red-500'}`}
          onPress={requestLocationPermission}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-medium font-['DM'] text-xl">Allow Location Access</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

