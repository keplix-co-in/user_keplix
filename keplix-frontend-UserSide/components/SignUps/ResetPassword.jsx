import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { authAPI } from '../../services/api';

export default function ResetPassword({ navigation, route }) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureEntryNew, setSecureEntryNew] = useState(true);
  const [secureEntryConfirm, setSecureEntryConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const email = route?.params?.email || '';
  const isFormFilled = otp.trim() !== "" && newPassword.trim() !== "" && confirmPassword.trim() !== "" && newPassword === confirmPassword && newPassword.length >= 6;

  return (
    <SafeAreaView className="flex-1 p-5 bg-white">
      <View className="flex-row items-center mb-10">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text className="font-medium text-[32px] mb-1 font-['DM'] text-black">Reset Password</Text>
      <Text className="text-xs text-[#999] mb-8 font-['DM']">
        Password must consist three characters.{'\n'}Must be number, symbol, text, uppercase.
      </Text>

      <View className="mt-4">
        <Text className="text-sm text-[#666] mb-2 font-['DM']">Enter your new password</Text>
        <View className="flex-row items-center border-2 border-[#E8E8E8] rounded-2xl px-4 h-[56px]">
          <TextInput
            className="flex-1 text-base text-black font-['DM']"
            placeholder="Eg: xyz@gmail.com"
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={secureEntryNew}
          />
          <TouchableOpacity onPress={() => setSecureEntryNew((prev) => !prev)}>
            <Ionicons
              name={secureEntryNew ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-5">
        <Text className="text-sm text-[#666] mb-2 font-['DM']">Confirm new password</Text>
        <View className="flex-row items-center border-2 border-[#E8E8E8] rounded-2xl px-4 h-[56px]">
          <TextInput
            className="flex-1 text-base text-black font-['DM']"
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureEntryConfirm}
          />
          <TouchableOpacity
            onPress={() => setSecureEntryConfirm((prev) => !prev)}
          >
            <Ionicons
              name={secureEntryConfirm ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
      </View>

      {newPassword && confirmPassword && newPassword !== confirmPassword && (
        <Text className="text-red-600 text-xs mt-2 font-['DM']">
          Passwords do not match
        </Text>
      )}

      <View className="flex-1" />

      <TouchableOpacity
        className={`rounded-full py-4 items-center mb-5 ${isFormFilled && !loading ? 'bg-red-600' : 'bg-[#CCCCCC]'}`}
        onPress={async () => {
          if (!isFormFilled || loading) return;

          if (!email) {
            Alert.alert("Error", "Email not found. Please try again.");
            return;
          }

          setLoading(true);

          try {
            await authAPI.resetPasswordWithOTP(email, otp, newPassword);
            
            Alert.alert(
              'Success',
              'Password reset successfully!',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate("PasswordChanged"),
                },
              ]
            );
          } catch (error) {
            console.error('Reset password error:', error);
            
            if (error.response?.data?.error) {
              Alert.alert('Reset Failed', error.response.data.error);
            } else {
              Alert.alert('Reset Failed', 'Failed to reset password. Please check your OTP and try again.');
            }
          } finally {
            setLoading(false);
          }
        }}
        activeOpacity={isFormFilled ? 0.7 : 1}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-medium font-['DM']">Reset password</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
