import React, { memo, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Memoized NavItem to prevent unnecessary re-renders
const NavItem = memo(({ icon, text, isActive, onPress }) => {
  return (
    <TouchableOpacity
      className="items-center flex-1 py-1"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={26}
        color={isActive ? "#EF4444" : "#9CA3AF"}
      />
      <Text className={`text-xs mt-1.5 font-medium ${isActive ? 'text-red-500' : 'text-gray-400'}`}>
        {text}
      </Text>
    </TouchableOpacity>
  );
});

NavItem.displayName = 'NavItem';

const Footer = ({ navigation, currentRoute }) => {
  const insets = useSafeAreaInsets();

  // Memoize navigation callbacks to prevent re-creating functions
  const navigateToHomepage = useCallback(() => navigation.navigate("Homepage"), [navigation]);
  const navigateToServices = useCallback(() => navigation.navigate("ServicesCard"), [navigation]);
  const navigateToBookings = useCallback(() => navigation.navigate("BookingList"), [navigation]);
  const navigateToProfile = useCallback(() => navigation.navigate("Profile"), [navigation]);

  // Memoize container style to prevent re-creation
  const containerStyle = useMemo(() => ({
    paddingBottom: insets.bottom,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  }), [insets.bottom]);

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row justify-around bg-white border-t border-gray-200 shadow-lg"
      style={containerStyle}
    >
      <NavItem icon="home" text="Home" isActive={currentRoute === "Homepage"} onPress={navigateToHomepage} />
      <NavItem icon="grid" text="Services" isActive={currentRoute === "ServicesCard"} onPress={navigateToServices} />
      <NavItem icon="document-text" text="Bookings" isActive={currentRoute === "BookingList"} onPress={navigateToBookings} />
      <NavItem icon="person" text="Profile" isActive={currentRoute === "Profile"} onPress={navigateToProfile} />
    </View>
  );
};

export default memo(Footer);
