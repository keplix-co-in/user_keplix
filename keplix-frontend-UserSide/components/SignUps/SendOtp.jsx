import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SendOtp({ navigation }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitted, setSubmitted] = useState(false);
  const inputRefs = [];

  const handleInputChange = (text, index) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      nextInputRef(index + 1);
    }
  };

  const nextInputRef = (index) => {
    if (inputRefs[index]) {
      inputRefs[index].focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  const handleVerifyOtp = () => {
    setSubmitted(true);
    const enteredOtp = otp.join('');
    if (!isOtpComplete) {
      Alert.alert("Incomplete OTP", "Please fill all the OTP fields.");
      return;
    }
    if (enteredOtp === '123456') {
      navigation.navigate('OtpVerified');
    } else {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
    }
  };

  const handleResend = () => {
    Alert.alert('OTP Sent', 'OTP has been sent again.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backcontainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        An OTP code has been sent via phone number +91**********
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs[index] = ref)}
            style={[
              styles.otpInput,
              submitted && otp[index] === '' && { borderColor: 'red' }
            ]}
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, isOtpComplete && { backgroundColor: 'red' }]}
        onPress={handleVerifyOtp}
      >
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResend}>
        <Text style={styles.resendText}>
          Didn’t receive OTP? <Text style={styles.link}>Resend</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        By signing or logging in, you agree to the{' '}
        <Text style={styles.link}>Terms and Conditions</Text> of service and{' '}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    color:'black',
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  backcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    color : 'black',
    fontSize: 30,
    borderColor: '#E2E2E2',
    borderWidth: 2,
    borderRadius: 50,
  },
  text: {
    color: 'black',
    fontSize: 24,
    color: '#0000008F',
    marginRight: 30,
    fontFamily: 'DM',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontWeight: '500',
    fontSize: 32,
    marginBottom: 15,
    fontFamily: 'DM',
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'DM',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 280,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    fontFamily: 'DM',
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 70,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'DM',
  },
  resendText: {
    borderRadius: 70,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    borderColor: '#E2E2E2',
    borderWidth: 2,
    padding: 15,
    fontFamily: 'DM',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    padding: 20,
    fontFamily: 'DM',
  },
  link: {
    color: 'red',
    textDecorationLine: 'underline',
    fontFamily: 'DM',
  },
});
