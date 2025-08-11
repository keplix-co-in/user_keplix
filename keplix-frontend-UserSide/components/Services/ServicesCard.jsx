// // export default ServicesCard;
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import Footer from "../Footer/Footer";
// 🔻 CategoryToggle pill component
const CategoryToggle = ({ iconName, title, description, isExpanded, onPress }) => (
  <View style={styles.categorycontainer}>
    <View style={styles.leftSection}>
      <Ionicons name={iconName} style={styles.iconStyle} size={30} color="black" />
      <View style={styles.textContainer}>
        <Text style={styles.categoryTitle}>{title}</Text>
        <Text style={styles.categoryDescription}>{description}</Text>
      </View>
    </View>
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button , {borderColor : isExpanded ? "red" : "#666"}]}>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={25}
          color="white"
          style={[styles.dropdownIcon ]}
        />
      </View>
    </TouchableOpacity>
  </View>
);

// 🔻 Category Grid Section
const CategorySection = ({ title, items, navigation }) => (
  <View style={styles.categorySection}>
    <View style={styles.sectionHeader}>
      <Text style={styles.categoryTitle}>{title}</Text>
    </View>
    <View style={styles.gridContainer}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.gridItem}
          onPress={() => navigation.navigate("ProviderList")}
        >
          {item.icon}
          <Text style={styles.gridText}>{item.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// 🔻 Bottom Navigation Item
const NavItem = ({ icon, text, active, navigation, targetScreen }) => (
  <TouchableOpacity
    style={styles.navItem}
    onPress={() => navigation.navigate(targetScreen)}
  >
    <Ionicons name={icon} size={34} color={active ? "#4E46B4" : "#666"} />
    <Text style={[styles.navText, active && styles.activeNavText]}>{text}</Text>
  </TouchableOpacity>
);

// 🔻 Main Screen Component
export default function ServicesCard({ navigation }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const repairItems = [
    {
      icon: <MaterialCommunityIcons name="engine" size={34} color="#000" />,
      text: "Engine",
    },
    { icon: <Ionicons name="disc" size={34} color="#000" />, text: "Brakes" },
    {
      icon: <FontAwesome5 name="cogs" size={34} color="#000" />,
      text: "Gearbox",
    },
  ];

  const cleaningItems = [
    {
      icon: <Ionicons name="water" size={34} color="#000" />,
      text: "Car Wash",
    },
    {
      icon: <Ionicons name="water" size={34} color="#000" />,
      text: "Foam Wash",
    },
    { icon: <Ionicons name="car" size={34} color="#000" />, text: "Interior" },
  ];

  const inspectionItems = [
    {
      icon: <Ionicons name="search" size={34} color="#000" />,
      text: "Check Engine",
    },
    {
      icon: <Ionicons name="speedometer" size={34} color="#000" />,
      text: "Performance",
    },
    { icon: <Ionicons name="alert" size={34} color="#000" />, text: "Safety" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SearchPage")}
            style={styles.headerIconButton}
          >
            <Ionicons name="search-outline" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("HamburgerMenu")}
            style={styles.headerIconButton}
          >
            <Ionicons name="menu-outline" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <CategoryToggle
        style={styles.categorycontainer}
          iconName="brush"
          title="Cleaning"
          description="Interior & exterior cleaning services"
          isExpanded={expandedSection === "Cleaning"}
          onPress={() =>
            setExpandedSection(expandedSection === "Cleaning" ? null : "Cleaning")
          }
        />
        {expandedSection === "Cleaning" && (
          <CategorySection
            title="Cleaning"
            items={cleaningItems}
            navigation={navigation}
          />
        )}

        <CategoryToggle
          iconName="construct"
          title="Repairs"
          description="Fix your car with professional help"
          isExpanded={expandedSection === "Repairs"}
          onPress={() =>
            setExpandedSection(expandedSection === "Repairs" ? null : "Repairs")
          }
        />
        {expandedSection === "Repairs" && (
          <CategorySection
            title="Repairs"
            items={repairItems}
            navigation={navigation}
          />
        )}

        <CategoryToggle
          iconName="search"
          title="Inspection"
          description="Routine checks and diagnostics with experts"
          isExpanded={expandedSection === "Inspection"}
          onPress={() =>
            setExpandedSection(expandedSection === "Inspection" ? null : "Inspection")
          }
        />
        {expandedSection === "Inspection" && (
          <CategorySection
            title="Inspection"
            items={inspectionItems}
            navigation={navigation}
          />
        )}
      </ScrollView>

      {/* <View style={styles.bottomNav}>
        <NavItem
          icon="home"
          text="Home"
          navigation={navigation}
          targetScreen="Homepage"
        />
        <NavItem
          icon="grid"
          text="Services"
          active
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
          navigation={navigation}
          targetScreen="Profile"
        />
      </View> */}
      <Footer navigation={navigation} />
      
    </SafeAreaView>
  );
}

// 🔻 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconButton: {
    marginLeft: 10,
  },
  icon: {
    fontSize: 30,
    borderColor: "#E2E2E2",
    borderWidth: 2,
    borderRadius: 50,
    padding: 5,
    color: "black",
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    color: "white",
  },
  categorycontainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#c9b9b9ff",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconStyle: {
    marginLeft: 12,
    marginRight: 12,
  },
  textContainer: {
    marginRight: 10,
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "DM",
    color: "black",
  },
  categoryDescription: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "DM",
    color: "#B0B0B0",
    flexWrap: "wrap",
  },
  button: {
    width: 50,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "white",
    marginRight: 10,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownIcon: {
    color: "black",
    marginRight: 10,
    marginLeft: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    flexDirection: "column",
    width: "30%",
    // backgroundColor: "#c8eaff",
    backgroundColor:"#e3eaeeff",
    borderColor: "#666",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
  },
  gridText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "DM",
    color: "#0000008F",
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
