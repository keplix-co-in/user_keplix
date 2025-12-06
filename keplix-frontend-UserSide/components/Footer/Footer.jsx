import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Footer = ({ navigation }) => {
  const route = useRoute(); //Get current active route name
  const insets = useSafeAreaInsets();

  const NavItem = ({ icon, text, targetScreen }) => {
    const isActive = route.name === targetScreen;

    return (
      <TouchableOpacity
        className="items-center flex-1"
        onPress={() => navigation.navigate(targetScreen)}
      >
        <View className={`p-2.5 rounded-[25px] ${isActive ? 'bg-red-500' : ''}`}>
          <Ionicons
            name={icon}
            size={24}
            color={isActive ? "white" : "gray"}
          />
        </View>
        <Text className={`text-xs mt-1 ${isActive ? 'text-red-500' : 'text-gray-600'}`}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View 
      className="absolute bottom-0 left-0 right-0 flex-row justify-around bg-white border-t border-gray-200 shadow-lg"
      style={{ 
        paddingBottom: insets.bottom,
        paddingTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10,
      }}
    >
      <NavItem icon="home" text="Home" targetScreen="Homepage" />
      <NavItem icon="grid" text="Services" targetScreen="ServicesCard" />
      <NavItem icon="document-text" text="Bookings" targetScreen="BookingList" />
      <NavItem icon="person" text="Profile" targetScreen="Profile" />
    </View>
  );
};

export default Footer;
