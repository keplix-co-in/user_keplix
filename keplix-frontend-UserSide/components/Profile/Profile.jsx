import React from "react";
import { View, Text,SafeAreaView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../Footer/Footer";

const SettingsItem = ({ icon, title, navigation, targetScreen }) => (
  <TouchableOpacity
    style={styles.settingsItem}
    onPress={() => navigation.navigate(targetScreen)}
  >
    <View style={styles.settingsItemLeft}>
      <Ionicons name={icon} size={24} color="#000" />
      <Text style={styles.settingsItemText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} />
  </TouchableOpacity>
);

const NavItem = ({ icon, text, active, navigation, targetScreen }) => (
  <TouchableOpacity
    style={styles.navItem}
    onPress={() => navigation.navigate(targetScreen)}
  >
    <Ionicons name={icon} size={34} color={active ? "#4E46B4" : "#666"} />
    <Text style={[styles.navText, active && styles.activeNavText]}>{text}</Text>
  </TouchableOpacity>
);

export default function Profile({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
    
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.logoutText}>Log out</Text>
          <Ionicons name="log-out-outline" size={20} color="#4E46B4" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <TouchableOpacity
        style={styles.profileSection}
        onPress={() => navigation.navigate("UserProfile")}
      >
        <View style={styles.profileInfo}>
          <Image
            source={require("../../assets/images/3.jpeg")} // Replace with actual image path
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>Nithish Kumar</Text>
            <Text style={styles.profilePhone}>+91 9731013245</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" style={styles.dropdownIcon} />
      </TouchableOpacity>

      {/* Settings Items */}
      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.settingContainer}>
        <View style={styles.settingsList}>
        <SettingsItem
          icon="card"
          title="Payment Methods"
          navigation={navigation}
          targetScreen="UpdatePayment"
        />
        <SettingsItem
          icon="time-outline"
          title="Booking History"
          navigation={navigation}
          targetScreen="BookingList"
        />
        <SettingsItem
          icon="star"
          title="My Reviews"
          navigation={navigation}
          targetScreen="ReviewList"
        />
        <SettingsItem
          icon="shield"
          title="Security Settings"
          navigation={navigation}
          targetScreen="Security"
        />
        <SettingsItem
          icon="notifications"
          title="Notification Settings"
          navigation={navigation}
          targetScreen="Notification"
        />
        <SettingsItem
          icon="help-circle-outline"
          title="Support & Help"
          navigation={navigation}
          targetScreen="Support"
        />
      </View>
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* <NavItem 
    icon="home" 
    text="Home"  
    navigation={navigation} 
    targetScreen="Homepage" 
  />
  <NavItem 
    icon="grid" 
    text="Services" 
    navigation={navigation} 
    targetScreen="ServicesCard" 
  />
  <NavItem 
    icon="document-text" 
    text="Bookings" 
    navigation={navigation} 
    targetScreen="BookingList" 
  />
  <NavItem 
    icon="person" 
    text="Profile"
    active 
    navigation={navigation} 
    targetScreen="Profile" 
  /> */}
      </View>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    padding: 20,
  },
  icon: {
    fontSize: 30,
    borderColor: "#E2E2E2",
    borderWidth: 2,
    borderRadius: 50,
    padding: 5,
  },
  backButton: {
    padding: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logoutText: {
    color: "#4E46B4",
    fontSize: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    width: "95%",
    marginBottom: 20,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: "#E2E2E2",
    borderRadius: 24,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    fontWeight: "500",
    fontFamily: "DM",
  },
  profilePhone: {
    fontSize: 16,
    color: "#0000008F",
    marginTop: 4,
    fontWeight: "500",
    fontFamily: "DM",
  },
  dropdownIcon: {
    width: 20,
    height: 30,
    fontSize: 18,
    lineHeight: 26,
    color: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.56)",
    borderWidth: 1.5,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    color: "#0000008F",
    paddingHorizontal: 16,
    marginBottom: 8,
    fontWeight: "500",
    fontFamily: "DM",
  },
  settingContainer:{
      // width: 361,
      // height: 436.0001525878906,
      // top: 282px,
      // left: 16px,
      // gap: 24px;
      // angle: 0 deg,
      // opacity: 1,
  },
  settingsList: {
    flex: 1,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E2E2",
    width: "95%",
    marginLeft: 10,
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsItemText: {
    fontSize: 16,
    color: "#333",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#666",
    fontSize: 12,
    marginTop: 5,
  },
  activeNavText: {
    color: "#4E46B4",
  },
});
