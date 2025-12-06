import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function Payment5({ navigation, route }) {
  const [focusedField, setFocusedField] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [amount, setAmount] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cvv: "",
    validThru: "",
    name: "",
  });

  const [bankListVisible, setBankListVisible] = useState(true); // Control visibility of bank list

  const banks = ["HDFC Bank", "IDBI Bank", "SBI Bank", "CANARA Bank"];

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
  };

  const handleBankSelect = (bank, index) => {
    setCardDetails({ ...cardDetails, name: bank });
    setSelectedBank(index);
    setBankListVisible(false); // Hide bank list
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

        <Text className="text-sm text-gray-500 mb-6 font-dm px-5">Select your bank for net banking</Text>

        <View className="mx-5 border border-[#E8E8E8] rounded-2xl mb-5 p-5 bg-white">
          <View className="mb-5">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-3">
                <FontAwesome name="bank" size={24} color="#DC2626" />
              </View>
              <Text className="text-lg font-bold text-gray-900 font-dm">Net Banking</Text>
            </View>

            <Text className="text-sm text-gray-700 font-semibold font-dm mb-2">
              Select your bank
            </Text>
            <View className="px-4 py-3 bg-gray-50 border border-[#E8E8E8] rounded-xl">
              <Text className="text-sm text-gray-600 font-dm">
                {cardDetails.name || 'Choose from the list below'}
              </Text>
            </View>
          </View>

          {bankListVisible && (
            <View className="mb-4">
              {banks.map((bank, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center justify-between py-4 px-4 rounded-xl mb-2 ${selectedBank === index ? 'bg-red-600' : 'bg-gray-50 border border-[#E8E8E8]'}`}
                  onPress={() => handleBankSelect(bank, index)}
                >
                  <Text
                    className={`text-base font-semibold font-dm ${selectedBank === index ? 'text-white' : 'text-gray-900'}`}
                  >
                    {bank}
                  </Text>
                  {selectedBank === index && (
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        className={`rounded-full py-4 mx-5 items-center mb-5 ${selectedBank !== null ? 'bg-red-600' : 'bg-gray-300'}`}
        onPress={() => {
          if (selectedBank !== null) {
            navigation.navigate("PaymentSuccess", {
              amount,
              bookingId,
              service: serviceData,
              paymentMethod: 'netbanking',
              transactionId: `NB${Date.now()}`,
            });
          }
        }}
        disabled={selectedBank === null}
      >
        <Text className="text-white text-base font-bold font-dm">Pay ₹{amount.toLocaleString()}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
