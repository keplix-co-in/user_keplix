import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import AsyncStorage from '@react-native-async-storage/async-storage';

const savedCards = {
  "1234567890123456": {
    name: "Nithish Kumar",
    validThru: "01/2024",
  },
};

export default function Payment2({ navigation, route }) {
  const [isSaved, setIsSaved] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [amount, setAmount] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cvv: "",
    validThru: "",
    name: "",
  });

  useEffect(() => {
    // Get payment info from route params
    const { amount: paymentAmount, bookingId: booking, service } = route?.params || {};
    setAmount(paymentAmount || 0);
    setBookingId(booking);
    setServiceData(service);
  }, [route?.params]);

  const handleCardNumberChange = (text) => {
    const formattedText = text.replace(/[^0-9]/g, "");
    const isValid = savedCards[formattedText] !== undefined;
    setErrorField(isValid ? null : "cardNumber");
    setCardDetails((prev) => ({
      ...prev,
      cardNumber: formattedText,
      ...(isValid ? savedCards[formattedText] : { name: "", validThru: "" }),
    }));
  };

  const handleInputChange = (field, value) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: value.replace(/[^0-9]/g, ""),
    }));
  };

  const isOtpEnabled =
    cardDetails.cardNumber.length === 16 &&
    cardDetails.cvv.length === 3 &&
    cardDetails.validThru.length === 7 &&
    cardDetails.name.trim() !== "";

  const handleSendOtp = async () => {
    if (isSaved) {
      try {
        // Save card details to AsyncStorage
        const savedMethods = await AsyncStorage.getItem('payment_methods');
        const methods = savedMethods ? JSON.parse(savedMethods) : { cards: [] };
        
        const newCard = {
          cardNumber: `xxxx xxxx xxxx ${cardDetails.cardNumber.slice(-4)}`,
          bankName: 'Bank',
          expiryDate: cardDetails.validThru.replace(/(\d{2})(\d{4})/, '$1 / $2'),
        };
        
        methods.cards.push(newCard);
        await AsyncStorage.setItem('payment_methods', JSON.stringify(methods));
      } catch (error) {
        console.error('Error saving card:', error);
      }
    }
    
    // Navigate to OTP screen
    navigation.navigate("Payment3", { amount, bookingId, service: serviceData, cardDetails });
  };

  const CheckboxComponent = () => (
    <TouchableOpacity
      className="flex-row items-center mt-4"
      onPress={() => setIsSaved(!isSaved)}
    >
      <View className={`w-6 h-6 border-2 rounded-lg items-center justify-center mr-3 ${isSaved ? 'bg-red-600 border-red-600' : 'border-[#E8E8E8]'}`}>
        {isSaved && <Ionicons name="checkmark" size={16} color="#FFF" />}
      </View>
      <Text className="text-sm text-gray-600 font-dm">Save details for future</Text>
    </TouchableOpacity>
  );

  return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View className="flex-row items-center px-5 pt-5 pb-4">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
            >
              <Ionicons name="arrow-back-outline" size={24} color="#000" />
            </TouchableOpacity>
            <View className="flex-1 items-center pr-10">
              <Text className="text-2xl font-semibold text-gray-900 font-dm">Payment</Text>
            </View>
          </View>

          <Text className="text-base text-gray-500 mb-6 font-dm px-5">Card details</Text>

          <View className="mx-4 border border-[#E8E8E8] rounded-2xl mb-5 p-5 bg-white">
            <View className="mb-6">
              <View className="flex-row items-center mb-6">
                <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-3">
                  <Fontisto name="credit-card" size={20} color="#DC2626" />
                </View>
                <Text className="text-lg font-semibold text-gray-900 font-dm">Debit / Credit Card</Text>
              </View>

              <Text
                className={`text-sm mb-2 font-medium font-dm ${focusedField === "cardNumber" ? 'text-red-600' : 'text-gray-700'}`}
              >
                Card Number
              </Text>
              <TextInput
                className={`border-2 rounded-2xl px-4 py-3 text-base font-dm ${focusedField === "cardNumber" ? 'border-red-600' : errorField === "cardNumber" ? 'border-red-500' : 'border-[#E8E8E8]'}`}
                placeholder="xxxx-xxxx-xxxx-xxxx"
                keyboardType="numeric"
                value={cardDetails.cardNumber}
                onChangeText={handleCardNumberChange}
                maxLength={16}
                onFocus={() => setFocusedField("cardNumber")}
                onBlur={() => setFocusedField(null)}
              />
              {errorField === "cardNumber" && (
                <Text className="text-red-500 text-xs mt-1">Invalid Card Number</Text>
              )}
            </View>

            <View className="flex-row justify-between">
              <View className="mb-5 w-[48%]">
                <Text
                  className={`text-sm mb-2 font-medium font-dm ${focusedField === "cvv" ? 'text-red-600' : 'text-gray-700'}`}
                >
                  CVV/CVC No.
                </Text>
                <TextInput
                  className={`border-2 rounded-2xl px-4 py-3 text-base font-dm ${focusedField === "cvv" ? 'border-red-600' : 'border-[#E8E8E8]'}`}
                  placeholder="000"
                  maxLength={3}
                  keyboardType="numeric"
                  value={cardDetails.cvv}
                  onChangeText={(text) => handleInputChange("cvv", text)}
                  onFocus={() => setFocusedField("cvv")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <View className="mb-5 w-[48%]">
                <Text
                  className={`text-sm mb-2 font-medium font-dm ${focusedField === "validThru" ? 'text-red-600' : 'text-gray-700'}`}
                >
                  Valid Thru
                </Text>
                <TextInput
                  className={`border-2 rounded-2xl px-4 py-3 text-base font-dm ${focusedField === "validThru" ? 'border-red-600' : 'border-[#E8E8E8]'}`}
                  placeholder="mm/yyyy"
                  maxLength={7}
                  keyboardType="numeric"
                  value={cardDetails.validThru}
                  onChangeText={(text) => handleInputChange("validThru", text)}
                  onFocus={() => setFocusedField("validThru")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <View className="mb-6">
              <Text
                className={`text-sm mb-2 font-medium font-dm ${focusedField === "name" ? 'text-red-600' : 'text-gray-700'}`}
              >
                Full Name
              </Text>
              <TextInput
                className={`border-2 rounded-2xl px-4 py-3 text-base font-dm ${focusedField === "name" ? 'border-red-600' : 'border-[#E8E8E8]'}`}
                placeholder="Name"
                value={cardDetails.name}
                onChangeText={(text) =>
                  setCardDetails((prev) => ({ ...prev, name: text }))
                }
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <TouchableOpacity
              className={`py-4 rounded-full items-center ${isOtpEnabled ? 'bg-red-600' : 'bg-gray-300'}`}
              disabled={!isOtpEnabled}
              onPress={handleSendOtp}
            >
              <Text className="text-white text-base font-semibold font-dm">
                Send OTP
              </Text>
            </TouchableOpacity>

            <CheckboxComponent />
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}
