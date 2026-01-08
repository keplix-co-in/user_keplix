import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Payment4({ navigation }) {
  const [upiId, setUpiId] = useState("");
  const [isUpiValid, setIsUpiValid] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const upiDatabase = {
    GooglePay: "@okaxis",
    Paytm: "@paytm",
    PhonePe: "@ybl",
    Amazon: "@apl",
  };

  // Validate UPI ID - supports multiple formats
  const validateUpiId = (input) => {
    // Pattern: phone@provider or name@provider
    const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiPattern.test(input);
  };

  const handleUpiInputChange = (input) => {
    setUpiId(input.toLowerCase().trim());
    setIsUpiValid(validateUpiId(input.trim()));
    // Reset verification status when input changes
    if (isVerified) {
      setIsVerified(false);
    }
  };

  const handleAppClick = (appName) => {
    // Prompt user to enter their UPI ID for the selected app
    const provider = upiDatabase[appName];
    Alert.alert(
      `${appName} UPI`,
      `Enter your UPI ID (e.g., yourname${provider})`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleVerify = async () => {
    if (!isUpiValid) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID');
      return;
    }

    setLoading(true);

    // Simulate verification (in production, verify with payment gateway)
    setTimeout(() => {
      setIsVerified(true);
      setLoading(false);
      Alert.alert('Success', 'UPI ID verified successfully!');
    }, 1500);
  };

  const handleAddUPI = async () => {
    if (!isVerified) {
      Alert.alert('Verification Required', 'Please verify your UPI ID first');
      return;
    }

    setLoading(true);

    try {
      // Get existing payment methods
      const savedMethods = await AsyncStorage.getItem('payment_methods');
      const methods = savedMethods ? JSON.parse(savedMethods) : { cards: [], upiIds: [], default: 'card' };

      // Add UPI ID
      if (!methods.upiIds) methods.upiIds = [];
      
      // Check if UPI ID already exists
      const exists = methods.upiIds.some(upi => upi.upiId === upiId);
      if (exists) {
        Alert.alert('Already Exists', 'This UPI ID is already saved');
        setLoading(false);
        return;
      }

      const newUPI = {
        upiId: upiId,
        provider: getUPIProvider(upiId),
        addedDate: new Date().toISOString(),
        isVerified: true,
      };

      methods.upiIds.push(newUPI);

      // Save to AsyncStorage
      await AsyncStorage.setItem('payment_methods', JSON.stringify(methods));

      Alert.alert(
        'Success',
        'UPI ID added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ConfirmUpdate'),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving UPI ID:', error);
      Alert.alert('Error', 'Failed to add UPI ID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUPIProvider = (upiId) => {
    const provider = upiId.split('@')[1];
    const providerMap = {
      'okaxis': 'Google Pay',
      'paytm': 'Paytm',
      'ybl': 'PhonePe',
      'apl': 'Amazon Pay',
      'axisbank': 'Axis Bank',
      'icici': 'ICICI Bank',
    };
    return providerMap[provider] || 'UPI';
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center mb-5 p-5">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={"arrow-back-outline"} size={24} className="border-2 border-[#E2E2E2] rounded-full p-[5px]" />
          </TouchableOpacity>
        </View>

        <Text className="font-medium text-2xl font-['DM'] ml-[23px]">Payment</Text>
        <Text className="text-base text-[#666] mb-[30px] font-medium font-['DM'] ml-5">Select payment method</Text>

        <View className="flex-1 p-5 mx-[15px] border-2 border-[#E2E2E2] rounded-2xl bg-white">
          <TouchableOpacity className="flex-row items-center justify-between mb-5">
            <FontAwesome5 name="rupee-sign" size={24} color="#000" className="mr-2.5" />
            <View className="flex-1">
              <Text className="text-2xl font-medium text-[#1E1E1E] font-['DM']">UPI</Text>
            </View>
          </TouchableOpacity>

          <Text className="text-xs text-black font-medium font-['DM'] mb-2.5">Choose App</Text>

          <View className="flex-row justify-between my-5">
            <TouchableOpacity
              className="flex-1 items-center mx-2.5 border-2 border-[#E2E2E2] rounded-lg p-2.5"
              onPress={() => handleAppClick("GooglePay")}
            >
              <Image
                source={require("../../assets/images/icons8-google-pay-48.png")}
                className="h-11 w-11"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center mx-2.5 border-2 border-[#E2E2E2] rounded-lg p-2.5"
              onPress={() => handleAppClick("Paytm")}
            >
              <Image
                source={require("../../assets/images/icons8-paytm-48.png")}
                className="h-11 w-11"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center mx-2.5 border-2 border-[#E2E2E2] rounded-lg p-2.5"
              onPress={() => handleAppClick("PhonePe")}
            >
              <Image
                source={require("../../assets/images/phonepe-icon.png")}
                className="h-11 w-11"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center mx-2.5 border-2 border-[#E2E2E2] rounded-lg p-2.5"
              onPress={() => handleAppClick("Amazon")}
            >
              <Image
                source={require("../../assets/images/icons8-amazon-48.png")}
                className="h-11 w-11"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center my-2.5 mx-2.5 w-[95%]">
            <View className="flex-1 h-px bg-[#ddd]" />
            <Text className="mx-2.5 text-[#0000008F] font-semibold font-['DM']">Or</Text>
            <View className="flex-1 h-px bg-[#ddd]" />
          </View>

          <Text className="text-xs text-black font-medium font-['DM'] mb-2.5">Enter UPI ID</Text>
          <View className="flex-row items-center justify-between mb-5">
            <TextInput
              className="border border-[#E2E2E2] rounded-lg p-2.5 text-sm w-[75%] mx-[5px]"
              placeholder="Enter UPI ID"
              value={upiId}
              onChangeText={handleUpiInputChange}
            />

            <TouchableOpacity
              className={`p-3 rounded-lg items-center ${isUpiValid && !loading ? (isVerified ? 'bg-green-100' : 'bg-[#40A69F]') : 'bg-[#0000008F]'}`}
              onPress={handleVerify}
              disabled={!isUpiValid || loading || isVerified}
            >
              {loading && !isVerified ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  className={`text-sm font-semibold font-['DM'] ${isVerified ? 'text-green-700' : 'text-white'}`}
                >
                  {isVerified ? "✓ Verified" : "Verify"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className={`p-[15px] rounded-[70px] items-center mx-5 mt-[180px] ${isVerified && !loading ? 'bg-[#DC2626]' : 'bg-[#0000008F]'}`}
          onPress={handleAddUPI}
          disabled={!isVerified || loading}
        >
          {loading && isVerified ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold font-['DM']">Add UPI</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

