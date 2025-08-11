import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureEntryNew, setSecureEntryNew] = useState(true);
  const [secureEntryConfirm, setSecureEntryConfirm] = useState(true);

  const [submitted, setSubmitted] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isEmailValid = emailRegex.test(email.trim());
  const isPasswordMatch = newPassword === confirmPassword;
  const isPasswordLengthValid = newPassword.length >= 6;

  const isFormValid =
    email.trim() &&
    newPassword.trim() &&
    confirmPassword.trim() &&
    isEmailValid &&
    isPasswordMatch &&
    isPasswordLengthValid;

  const handleVerify = () => {
    setSubmitted(true);
    if (isFormValid) {
      navigation.navigate("EmailVerify");
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.backcontainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Sign Up</Text>

      <View>
        <Text style={styles.enter}>Enter your email address</Text>
        <TextInput
          style={[
            styles.input,
            submitted && (!email.trim() || !isEmailValid) && { borderColor: 'red' },
          ]}
          placeholder="Eg: xyz@gmail.com"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View>
        <Text style={styles.enter}>Enter your new password</Text>
        <View style={[
          styles.inputContainer,
          submitted && (!newPassword.trim() || !isPasswordLengthValid) && { borderColor: 'red' }
        ]}>
          <TextInput
            style={styles.input1}
            placeholder="Min 6 characters"
            placeholderTextColor="#aaa"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={secureEntryNew}
          />
          <TouchableOpacity onPress={() => setSecureEntryNew(prev => !prev)}>
            <Ionicons
              name={secureEntryNew ? "eye-off" : "eye"}
              style={styles.iconInsideInput}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.enter}>Confirm new password</Text>
      <View style={[
        styles.inputContainer1,
        submitted && (!confirmPassword.trim() || !isPasswordMatch) && { borderColor: 'red' }
      ]}>
        <TextInput
          style={styles.input1}
          placeholder="Re-enter password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secureEntryConfirm}
        />
        <TouchableOpacity onPress={() => setSecureEntryConfirm(prev => !prev)}>
          <Ionicons
            name={secureEntryConfirm ? "eye-off" : "eye"}
            style={styles.iconInsideInput}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isFormValid ? 'red' : '#888' },
        ]}
        onPress={handleVerify}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUpPhone")}>
        <Text style={styles.createAccountText}>
          or Sign up using 
          <Text style={{color: "red" , fontWeight: "15"}}>{" "}Phone number</Text>
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
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  backcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 30,
    borderColor: '#E2E2E2',
    color: 'black',
    borderWidth: 2,
    borderRadius: 50,
  },
  text: {
    fontSize: 24,
    marginRight: 30,
    color: "black",
    fontFamily: 'DM',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    color: 'black',
    fontSize: 32,
    marginBottom: 10,
    fontFamily: 'DM',
  },
  enter: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    fontFamily: 'DM',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    // borderColor: 'black',
    borderWidth: 2,
    borderRadius: 70,
    marginBottom: 30,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'DM',
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    color: 'black',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 70,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  inputContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 70,
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  input1: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: 'black',
    fontFamily: 'DM',
  },
  iconInsideInput: {
    fontSize: 24,
    marginLeft: 10,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 70,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 70,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'DM',
  },
  createAccountText: {
    borderRadius: 70,
    textAlign: 'center',
    color: '#666',
    fontSize: 15,
    borderColor: '#E2E2E2',
    borderWidth: 2,
    padding: 15,
    fontFamily: 'DM',
  },
  footerText: {
    fontSize: 15,
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
