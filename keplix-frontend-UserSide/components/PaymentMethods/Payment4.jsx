import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function Payment4({ navigation, route }) {
  const [upiId, setUpiId] = useState("");
  const [isUpiValid, setIsUpiValid] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [amount, setAmount] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const [serviceData, setServiceData] = useState(null);

  useEffect(() => {
    // Get payment info from route params
    const { amount: paymentAmount, bookingId: booking, service } = route?.params || {};
    setAmount(paymentAmount || 0);
    setBookingId(booking);
    setServiceData(service);
  }, [route?.params]);

  const upiDatabase = {
    GooglePay: "googlepay@upi",
    Paytm: "paytm@upi",
    PhonePe: "phonepe@upi",
    Amazon: "amazon@upi",
  };

  // Validate UPI ID (10 digit number + ID suffix)
  const validateUpiId = (input) => {
    // Check for pattern: 10 digits followed by @ and some text
    const upiPattern = /^\d{10}@[a-zA-Z0-9]+$/;
    return upiPattern.test(input);
  };

  const handleUpiInputChange = (input) => {
    setUpiId(input);
    setIsUpiValid(validateUpiId(input));
    // Reset verification status when input changes
    if (isVerified) {
      setIsVerified(false);
    }
  };

  const handleAppClick = (appName) => {
    // When clicking an app, we should set a valid UPI ID format
    // For this example, we'll use a dummy 10-digit number with the app's UPI suffix
    const dummyNumber = "9876543210";
    const selectedUpiId = dummyNumber + upiDatabase[appName];
    setUpiId(selectedUpiId);
    setIsUpiValid(validateUpiId(selectedUpiId));
    // Reset verification status
    setIsVerified(false);
  };

  const handleVerify = () => {
    if (isUpiValid) {
      setIsVerified(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between px-5 mb-5">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
          >
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 font-dm">Payment</Text>
          <View className="w-10" />
        </View>

        <Text className="text-sm text-gray-500 mb-6 font-dm px-5">Choose your UPI app or enter UPI ID</Text>

        <View className="flex-1 p-5 mx-5 border border-[#E8E8E8] rounded-2xl bg-white">
          <View className="flex-row items-center mb-5">
            <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-3">
              <FontAwesome5 name="rupee-sign" size={24} color="#DC2626" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 font-dm">UPI Payment</Text>
            </View>
          </View>

          <Text className="text-sm text-gray-700 font-semibold font-dm mb-3">Choose App</Text>

          <View className="flex-row justify-between mb-5">
            <TouchableOpacity
              className="flex-1 items-center mx-1 border border-[#E8E8E8] rounded-xl p-3 bg-gray-50"
              onPress={() => handleAppClick("GooglePay")}
            >
              <Image
                source={require("../../assets/images/icons8-google-pay-48.png")}
                className="h-12 w-12"
                style={{resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center mx-1 border border-[#E8E8E8] rounded-xl p-3 bg-gray-50"
              onPress={() => handleAppClick("Paytm")}
            >
              <Image
                source={require("../../assets/images/icons8-paytm-48.png")}
                className="h-12 w-12"
                style={{resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center mx-1 border border-[#E8E8E8] rounded-xl p-3 bg-gray-50"
              onPress={() => handleAppClick("PhonePe")}
            >
              <Image
                source={require("../../assets/images/phonepe-icon.png")}
                className="h-12 w-12"
                style={{resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center mx-1 border border-[#E8E8E8] rounded-xl p-3 bg-gray-50"
              onPress={() => handleAppClick("Amazon")}
            >
              <Image
                source={require("../../assets/images/icons8-amazon-48.png")}
                className="h-12 w-12"
                style={{resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-3 text-sm text-gray-500 font-semibold font-dm">Or</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          <Text className="text-sm text-gray-700 font-semibold font-dm mb-2">Enter UPI ID</Text>
          <View className="flex-row items-center mb-5 gap-2">
            <TextInput
              className="flex-1 border border-[#E8E8E8] rounded-xl px-4 py-3 text-sm font-dm bg-gray-50"
              placeholder="yourname@upi"
              placeholderTextColor="#9CA3AF"
              value={upiId}
              onChangeText={handleUpiInputChange}
            />

            <TouchableOpacity
              className={`px-5 py-3 rounded-xl items-center ${isVerified ? 'bg-green-50 border border-green-200' : isUpiValid ? 'bg-teal-500' : 'bg-gray-300'}`}
              onPress={handleVerify}
              disabled={!isUpiValid}
            >
              <Text
                className={`text-sm font-bold font-dm ${isVerified ? 'text-green-600' : 'text-white'}`}
              >
                {isVerified ? "✓ Verified" : "Verify"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1" />

        <TouchableOpacity
          className={`py-4 rounded-full items-center mx-5 mb-5 ${isVerified ? 'bg-red-600' : 'bg-gray-300'}`}
          onPress={() => {
            if (isVerified) {
              navigation.navigate("PaymentSuccess", {
                amount,
                bookingId,
                service: serviceData,
                paymentMethod: 'upi',
                transactionId: `UPI${Date.now()}`,
              });
            }
          }}
          disabled={!isVerified}
        >
          <Text className="text-white text-base font-bold font-dm">Pay ₹{amount.toLocaleString()}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
