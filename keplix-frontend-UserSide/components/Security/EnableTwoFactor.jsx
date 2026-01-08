import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EnableTwoFactor({ navigation }) {
  const [step, setStep] = useState(1); // 1: Create, 2: Confirm
  const [firstPin, setFirstPin] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [saving, setSaving] = useState(false);
  
  // Refs for inputs
  const input0 = useRef();
  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const input4 = useRef();
  const input5 = useRef();
  const inputs = [input0, input1, input2, input3, input4, input5];

  useEffect(() => {
    // Reset PIN when step changes
    setPin(['', '', '', '', '', '']);
    // Focus first input
    setTimeout(() => input0.current?.focus(), 100);
  }, [step]);

  const handleChange = (value, index) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-advance
    if (value && index < 5) {
      inputs[index + 1].current?.focus();
    }
    // Auto-submit or Auto-check when filled
    if (index === 5 && value) {
        // slight delay to allow render
        setTimeout(() => handleStepComplete([...newPin, value].slice(0,6).join('')), 100);
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
       if (pin[index] === '' && index > 0) {
           inputs[index - 1].current?.focus();
           const newPin = [...pin];
           newPin[index - 1] = '';
           setPin(newPin);
       }
    }
  };

  const isComplete = pin.every((val) => val !== '');

  const handleStepComplete = async (fullPin) => {
      // Because handleChange passes the potentially stale state or partial state, 
      // best to rely on the argument if passed, or current state.
      // But typically React batch updates. We'll use the 'pin' state logic on button press mainly.
  };

  const handleNext = async () => {
    const currentPinCode = pin.join('');
    
    if (step === 1) {
        setFirstPin(currentPinCode);
        setStep(2);
    } else {
        // Confirm step
        if (currentPinCode !== firstPin) {
            Alert.alert("Mismatch", "PINs do not match. Please try again.");
            setStep(1); // Start over
            setFirstPin('');
            return;
        }
        await savePin(currentPinCode);
    }
  };

  const savePin = async (finalPin) => {
    setSaving(true);
    try {
      // Merge with existing settings or create new
      const existingRaw = await AsyncStorage.getItem('two_factor_settings');
      const existing = existingRaw ? JSON.parse(existingRaw) : {};

      const twoFactorSettings = {
        ...existing,
        enabled: true, // Not fully enabled until Confirm screen? Or partial? 
                       // Usually enabled after flow. But verifying email comes next.
        pin: finalPin,
        updatedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('two_factor_settings', JSON.stringify(twoFactorSettings));
      navigation.navigate('AddEmail');
    } catch (error) {
      console.error('Error saving 2FA settings:', error);
      Alert.alert('Error', 'Failed to save PIN');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 px-6 bg-white">
      <View className="mt-5 mb-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-[20px] border-2 border-[#E2E2E2] justify-center items-center">
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-medium text-center mb-[30px] font-['DM'] text-black">
        {step === 1 ? 'Create a PIN' : 'Confirm your PIN'}
      </Text>

      <View className="items-center mb-5">
        <MaterialCommunityIcons name="lock-outline" size={40} color="#DC2626" />
      </View>

      <Text className="text-sm text-center text-[#0000008F] font-['DM'] mb-5">
        {step === 1 ? 'Enter a 6-digit PIN to secure your account.' : 'Re-enter your PIN to confirm.'}
      </Text>

      <View className="flex-row justify-between mx-2 mb-10">
        {pin.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputs[index]}
            className={`w-11 h-12 text-center text-xl border-2 rounded-lg font-['DM'] ${digit ? 'border-[#DC2626] text-black' : 'border-[#E2E2E2] text-black'}`}
            maxLength={1}
            keyboardType="numeric"
            secureTextEntry={true} // Hide PIN
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={(e) => handleBackspace(e, index)}
          />
        ))}
      </View>

      <View className="mt-auto mb-5">
        <TouchableOpacity
          className={`rounded-[70px] py-4 items-center ${isComplete ? 'bg-[#DC2626]' : 'bg-gray-300'}`}
          disabled={!isComplete || saving}
          onPress={handleNext}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-medium font-['DM']">
                {step === 1 ? 'Next' : 'Save'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
