import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const usersDatabase = [
    { email: "test1@example.com", password: "password123" },
    { email: "test2@example.com", password: "mysecurepassword" },
    { email: "admin@example.com", password: "adminpass" },
  ];

  const isFormFilled = email.trim() !== "" && password.trim() !== "";

  const handleVerify = () => {
    const userExists = usersDatabase.some(
      (user) => user.email === email && user.password === password
    );

    if (userExists) {
      setIsValid(true);
      setIsVerified(true);
      navigation.navigate("Homepage");
    } else {
      setIsValid(false);
      setIsVerified(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backcontainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Log in using your credentials</Text>

      <View>
        <Text style={[styles.enter, { marginTop: 40 }]}>
          Enter your email address
        </Text>
        <TextInput
          style={[styles.input, !isValid && { borderColor: "red" }]}
          placeholder="Eg: xyz@gmail.com"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {!isValid && !email && (
          <Text style={styles.errorText}>Invalid email</Text>
        )}
      </View>

      <Text style={[styles.enter, { marginTop: 10 }]}>Enter password</Text>
      <View style={[styles.inputContainer, !isValid && { borderColor: "red" }]}>
        <TextInput
          style={styles.input1}
          placeholder="Eg: a62gjf7hi"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureEntry}
        />
        <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
          <Ionicons
            name={secureEntry ? "eye-off" : "eye"}
            style={styles.iconInsideInput}
          />
        </TouchableOpacity>
      </View>
      {!isValid && !password && (
        <Text style={styles.errorText}>Invalid password</Text>
      )}

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={[styles.forgotPasswordText, { marginTop: 10 }]}>
          Forgot password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          isFormFilled && { backgroundColor: "red" },
          isVerified && { backgroundColor: "#28A745" },
        ]}
        onPress={() => {
          if (isFormFilled) {
            handleVerify();
          }
        }}
        activeOpacity={isFormFilled ? 0.7 : 1}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.createAccountText}>
          Don’t have an account? <Text style={styles.link}>Create one</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  backcontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  icon: {
    fontSize: 30,
    color: "black",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 50,
  },
  text: {
    fontSize: 24,
    marginRight: 30,
    color: "#0000008F",
    fontFamily: "DM",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontWeight: "500",
    fontSize: 32,
    marginBottom: 10,
    color: "black",
    fontFamily: "DM",
  },
  subtitle: {
    fontSize: 16,
    color: "black",
    marginBottom: 20,
    fontFamily: "DM",
  },
  enter: {
    fontSize: 16,
    color: "black",
    marginBottom: 10,
    fontFamily: "DM",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    color: "black",
    borderWidth: 2,
    borderRadius: 70,
    marginBottom: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: "DM",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 2,
    borderRadius: 70,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  input1: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "black",
    fontFamily: "DM",
  },
  iconInsideInput: {
    fontSize: 24,
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 210,
  },
  forgotPasswordText: {
    color: "red",
    textDecorationLine: "underline",
    fontFamily: "DM",
  },
  button: {
    backgroundColor: "#0000008F",
    backgroundColor: "#666",
    borderRadius: 70,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "b",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "DM",
  },
  createAccountText: {
    borderRadius: 70,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    borderColor: "#ddd",
    borderWidth: 2,
    padding: 15,
    fontFamily: "DM",
  },
  link: {
    color: "red",
    fontWeight: "500",
    fontFamily: "DM",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
