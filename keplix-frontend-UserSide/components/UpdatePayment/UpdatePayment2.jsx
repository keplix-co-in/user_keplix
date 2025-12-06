import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Payment2({ navigation }) {
  const [isSaved, setIsSaved] = useState(true); // Default to true for saving
  const [focusedField, setFocusedField] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cvv: "",
    validThru: "",
    name: "",
  });

  const handleCardNumberChange = (text) => {
    const formattedText = text.replace(/[^0-9]/g, "");
    setErrorField(null);
    setCardDetails((prev) => ({
      ...prev,
      cardNumber: formattedText,
    }));
  };

  const handleInputChange = (field, value) => {
    if (field === "validThru") {
      // Auto-format date as MM/YYYY
      let formattedValue = value.replace(/[^0-9]/g, "");
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + "/" + formattedValue.substring(2, 6);
      }
      setCardDetails((prev) => ({
        ...prev,
        [field]: formattedValue,
      }));
    } else {
      setCardDetails((prev) => ({
        ...prev,
        [field]: value.replace(/[^0-9]/g, ""),
      }));
    }
  };

  const validateCard = () => {
    // Validate card number (Luhn algorithm would be ideal)
    if (cardDetails.cardNumber.length !== 16) {
      setErrorField("cardNumber");
      Alert.alert("Invalid Card", "Card number must be 16 digits");
      return false;
    }

    // Validate CVV
    if (cardDetails.cvv.length !== 3) {
      Alert.alert("Invalid CVV", "CVV must be 3 digits");
      return false;
    }

    // Validate expiry date
    const expiryParts = cardDetails.validThru.split('/');
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 4) {
      Alert.alert("Invalid Date", "Please enter valid expiry date (MM/YYYY)");
      return false;
    }

    const month = parseInt(expiryParts[0]);
    const year = parseInt(expiryParts[1]);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12) {
      Alert.alert("Invalid Month", "Month must be between 01 and 12");
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      Alert.alert("Expired Card", "Card has expired");
      return false;
    }

    // Validate name
    if (cardDetails.name.trim().length < 3) {
      Alert.alert("Invalid Name", "Please enter cardholder name");
      return false;
    }

    return true;
  };

  const handleAddCard = async () => {
    if (!validateCard()) return;

    setLoading(true);

    try {
      // Get existing payment methods
      const savedMethods = await AsyncStorage.getItem('payment_methods');
      const methods = savedMethods ? JSON.parse(savedMethods) : { cards: [], default: 'card' };

      // Create card object
      const newCard = {
        cardNumber: `**** **** **** ${cardDetails.cardNumber.slice(-4)}`,
        fullCardNumber: cardDetails.cardNumber, // Store for validation (in production, never store full card number)
        bankName: getCardBrand(cardDetails.cardNumber),
        expiryDate: cardDetails.validThru,
        cardholderName: cardDetails.name,
        addedDate: new Date().toISOString(),
      };

      // Add new card
      if (!methods.cards) methods.cards = [];
      methods.cards.push(newCard);

      // Save to AsyncStorage
      await AsyncStorage.setItem('payment_methods', JSON.stringify(methods));

      Alert.alert(
        'Success',
        'Card added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ConfirmUpdate'),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving card:', error);
      Alert.alert('Error', 'Failed to add card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCardBrand = (cardNumber) => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'American Express';
    if (firstDigit === '6') return 'Discover';
    return 'Credit Card';
  };

  const isAddEnabled =
    cardDetails.cardNumber.length === 16 &&
    cardDetails.cvv.length === 3 &&
    cardDetails.validThru.length === 7 &&
    cardDetails.name.trim() !== "";

  const CheckboxComponent = () => (
    <TouchableOpacity
      className="flex-row items-center mt-[15px]"
      onPress={() => setIsSaved(!isSaved)}
    >
      <View className={`w-5 h-5 border rounded items-center justify-center mr-2 ${isSaved ? 'bg-black border-black' : 'border-[#E2E2E2]'}`}>
        {isSaved && <Text className="text-white text-sm">✓</Text>}
      </View>
      <Text className="text-sm text-[#666] font-['DM']">Save details for future</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center mb-5 p-5">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={"arrow-back-outline"} size={24} className="border-2 border-[#E2E2E2] rounded-full p-[5px]" />
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-['DM'] font-medium ml-[23px]">Payment</Text>
        <Text className="text-base text-[#666] mb-[30px] font-medium font-['DM'] ml-5">Select payment method</Text>

        <View className="py-[15px] px-[15px] w-[92%] ml-[15px] border-2 border-[#E2E2E2] rounded-2xl mb-5 p-5">
          <View className="mb-5">
            <View className="flex-row items-center py-[5px] mb-5 bg-white">
              <Fontisto
                name="credit-card"
                size={20}
                color="#000"
                className="mr-2.5"
              />
              <Text className="text-xl font-medium text-[#1E1E1E] font-['DM']">Debit / Credit Card</Text>
            </View>

            <Text
              className={`text-sm mb-[5px] font-medium font-['DM'] ${focusedField === "cardNumber" ? 'text-[#DC2626]' : 'text-black'}`}
            >
              Card Number
            </Text>
            <TextInput
              className={`border rounded-lg p-2.5 text-sm font-normal font-['DM'] ${focusedField === "cardNumber" ? 'border-[#DC2626]' : errorField === "cardNumber" ? 'border-red-600' : 'border-[#E2E2E2]'}`}
              placeholder="xxxx-xxxx-xxxx-xxxx"
              keyboardType="numeric"
              value={cardDetails.cardNumber}
              onChangeText={handleCardNumberChange}
              maxLength={16}
              onFocus={() => setFocusedField("cardNumber")}
              onBlur={() => setFocusedField(null)}
            />
            {errorField === "cardNumber" && (
              <Text className="text-red-600 text-xs mt-[5px]">Invalid Card Number</Text>
            )}
          </View>

          <View className="flex-row justify-between">
            <View className="mb-5 w-[48%]">
              <Text
                className={`text-sm mb-[5px] font-medium font-['DM'] ${focusedField === "cvv" ? 'text-[#DC2626]' : 'text-black'}`}
              >
                CVV/CVC No.
              </Text>
              <TextInput
                className={`border rounded-lg p-2.5 text-sm font-normal font-['DM'] ${focusedField === "cvv" ? 'border-[#DC2626]' : 'border-[#E2E2E2]'}`}
                placeholder="OOO"
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
                className={`text-sm mb-[5px] font-medium font-['DM'] ${focusedField === "validThru" ? 'text-[#DC2626]' : 'text-black'}`}
              >
                Valid Thru
              </Text>
              <TextInput
                className={`border rounded-lg p-2.5 text-sm font-normal font-['DM'] ${focusedField === "validThru" ? 'border-[#DC2626]' : 'border-[#E2E2E2]'}`}
                placeholder="mm/yyyy"
                maxLength={7}
                keyboardType="default"
                value={cardDetails.validThru}
                onChangeText={(text) => handleInputChange("validThru", text)}
                onFocus={() => setFocusedField("validThru")}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View className="mb-5">
            <Text
              className={`text-sm mb-[5px] font-medium font-['DM'] ${focusedField === "name" ? 'text-[#DC2626]' : 'text-black'}`}
            >
              Full Name
            </Text>
            <TextInput
              className={`border rounded-lg p-2.5 text-sm font-normal font-['DM'] ${focusedField === "name" ? 'border-[#DC2626]' : 'border-[#E2E2E2]'}`}
              placeholder="Name"
              value={cardDetails.name}
              onChangeText={(text) =>
                setCardDetails((prev) => ({ ...prev, name: text }))
              }
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <CheckboxComponent />
        </View>
      </ScrollView>

      <TouchableOpacity
        className={`rounded-[70px] py-[15px] mx-5 items-center mb-5 w-[90%] ${isAddEnabled && !loading ? 'bg-[#DC2626]' : 'bg-[#0000008F]'}`}
        disabled={!isAddEnabled || loading}
        onPress={handleAddCard}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold font-['DM']">Add Card</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
