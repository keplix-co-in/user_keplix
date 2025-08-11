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

export default function ResetPassword({ navigation }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureEntryNew, setSecureEntryNew] = useState(true);
  const [secureEntryConfirm, setSecureEntryConfirm] = useState(true);
  const isFormFilled = newPassword.trim() !== "" && confirmPassword.trim() !== ""&& newPassword === confirmPassword;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backcontainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Password must consist these characters that is number, special and
        uppercase.
      </Text>

      <View>
        <Text style={styles.enter}>Enter your new password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input1}
            placeholder="Eg: a62gjf7hi"
            placeholderTextColor="#aaa"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={secureEntryNew}
          />
          <TouchableOpacity onPress={() => setSecureEntryNew((prev) => !prev)}>
            <Ionicons
              name={secureEntryNew ? "eye-off" : "eye"}
              style={styles.iconInsideInput}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.enter}>Confirm new password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input1}
          placeholder="Eg: a62gjf7hi"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secureEntryConfirm}
        />
        <TouchableOpacity
          onPress={() => setSecureEntryConfirm((prev) => !prev)}
        >
          <Ionicons
            name={secureEntryConfirm ? "eye-off" : "eye"}
            style={styles.iconInsideInput}
          />
        </TouchableOpacity>
      </View>
        {newPassword && confirmPassword && newPassword !== confirmPassword && (
        <Text style={{position: "center", color: "red", marginBottom: 10 }}>
          Passwords do not match.
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          isFormFilled
            ? { backgroundColor: "red" }
            : { backgroundColor: "#888" },
        ]}
        onPress={() => {
          if (isFormFilled) {
            navigation.navigate("PasswordChanged");
          }
        }}
        activeOpacity={isFormFilled ? 0.7 : 1}
      >
        <Text style={styles.buttonText}>Verify</Text>
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
    borderColor: "#eee1e1ff",
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
    fontFamily: "DM",
    color: "black",
  },
  subtitle: {
    fontSize: 16,
    color: "#0000008F",
    marginBottom: 20,
    fontFamily: "DM",
    color: "#666",
  },
  enter: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    fontFamily: "DM",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 2,
    borderRadius: 70,
    marginBottom: 30,
    color: "black",
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
  button: {
    backgroundColor: "red",
    borderRadius: 70,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 250,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "DM",
  },
});
