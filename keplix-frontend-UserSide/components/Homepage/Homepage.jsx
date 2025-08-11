import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Footer from "../Footer/Footer";
export default function Homepage({ navigation }) {
  const [activeDot, setActiveDot] = useState(0);
  const featuredServices = [
    { icon: "car", label: "Detailing", route: "Detailing" },
    { icon: "tools", label: "Repairs", route: "Repairs" },
    { icon: "car-brake-alert", label: "Brakes", route: "Brakes" },
    { icon: "seat", label: "Interior", route: "Interior" },
    { icon: "tire", label: "Tyres", route: "Tyres" },
    { icon: "fan", label: "AC Repair", route: "AC Repair" },
    { icon: "alarm-light", label: "Emergency", route: "Emergency" },
    { icon: "cassette", label: "Audio", route: "Audio" },
    { icon: "car-wrench", label: "Suspension", route: "Suspension" },
    { icon: "check-circle", label: "Inspection", route: "Inspection" },
    { icon: "car-windshield", label: "Windshield", route: "Windshield" },
    { icon: "steering", label: "Steering", route: "Steering" },
  ];

  const banners = [
    {
      color: "#4E46B4",
      iconBgColor: "#7972D6",
      discountText: "15%",
      discountDescription: "discount on\nthe first\norder.",
    },
    {
      color: "#FFBD2E",
      iconBgColor: "#FFD47E",
      discountText: "24/7",
      discountDescription: "Delivery service",
    },
  ];

  const currentBanner = banners[activeDot];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prevDot) => (prevDot + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={[styles.header, { backgroundColor: currentBanner.color }]}>
          <View style={styles.userInfo}>
            <Image
              source={require("../../assets/images/3.jpeg")}
              style={styles.avatar}
            />
            <Text
              style={[
                styles.greeting,
                { backgroundColor: currentBanner.iconBgColor },
              ]}
            >
              hello, Nithish
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate("SearchPage")}>
              <Ionicons
                name="search"
                size={24}
                color="white"
                style={[
                  styles.icon,
                  { backgroundColor: currentBanner.iconBgColor },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("HamburgerMenu")}
            >
              <Ionicons
                name="menu"
                size={24}
                color="white"
                style={[
                  styles.icon,
                  { backgroundColor: currentBanner.iconBgColor },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.banner, { backgroundColor: currentBanner.color }]}>
          <View style={styles.bannerContent}>
            <Text style={styles.discountText}>
              {currentBanner.discountText}
            </Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.discountDescription}>
                {currentBanner.discountDescription}
              </Text>
            </View>
          </View>
          <View style={styles.dotsContainer}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === activeDot
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.5)",
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText1}>
            Glad <Text style={styles.welcomeText2}>to see you again!</Text>
          </Text>
          <TouchableOpacity
            style={styles.newOrderButton}
            onPress={() => navigation.navigate("ServicesCard")}
          >
            <MaterialIcons name="add-box" size={20} color="white" />
            <Text style={styles.newOrderText}>New order</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Services
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ServicesCard")}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.servicesScroll}
          >
            <ServiceItem
              icon="brush"
              text="Detailing"
              onPress={() =>
                navigation.navigate("ProviderList", { service: "Detailing" })
              }
            />
            <ServiceItem
              icon="build"
              text="Repairs"
              onPress={() =>
                navigation.navigate("ProviderList", { service: "Repairs" })
              }
            />
            <ServiceItem
              icon="file-copy"
              text="Accessories"
              onPress={() =>
                navigation.navigate("ProviderList", { service: "Accessories" })
              }
            />
            <ServiceItem
              icon="file-copy"
              text="Accessories"
              onPress={() =>
                navigation.navigate("ProviderList", { service: "Accessories" })
              }
            />
          </ScrollView>
        </View>
         */}
        {/* <FlatList
  data={featuredServices}
  keyExtractor={(item, index) => index.toString()}
  numColumns={4}
  scrollEnabled={false}
  contentContainerStyle={{ paddingHorizontal: 10 }}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() =>
        navigation.navigate("ProviderList", { service: item.route })
      }
    >
      <MaterialCommunityIcons name={item.icon} size={28} color="#f10a0aff" />
      <Text style={styles.gridItemText}>{item.label}</Text>
    </TouchableOpacity>
  )}
/> */}

        <FlatList
          data={featuredServices}
          keyExtractor={(item, index) => index.toString()}
          numColumns={4}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() =>
                navigation.navigate("ProviderList", { service: item.route })
              }
            >
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={28}
                  color="#D10000"
                />
              </View>
              <Text style={styles.gridItemText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Upcoming Services */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming services</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.upcomingservicesScroll}
          >
            <View style={styles.upcomingCard}>
              <View style={styles.upcomingInfo}>
                <MaterialIcons name="brush" size={30} color="#000" />
                <View style={styles.upcomingDetails}>
                  <Text style={styles.upcomingTitle}>Detailing</Text>
                  <Text style={styles.upcomingLocation}>
                    Dwarka mor repair service...
                  </Text>
                  <Text style={styles.upcomingTime}>Today | 4:30pm</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("ServicesCard")}
              >
                <MaterialCommunityIcons
                  name="arrow-top-right"
                  size={34}
                  color="#fff"
                  style={styles.iconleft}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.upcomingCard}>
              <View style={styles.upcomingInfo}>
                <MaterialIcons name="brush" size={24} color="#666" />
                <View style={styles.upcomingDetails}>
                  <Text style={styles.upcomingTitle}>Detailing</Text>
                  <Text style={styles.upcomingLocation}>
                    Dwarka mor repair service...
                  </Text>
                  <Text style={styles.upcomingTime}>Today | 4:30pm</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("ServicesCard")}
              >
                <MaterialCommunityIcons
                  name="arrow-top-right"
                  size={34}
                  color="#fff"
                  style={styles.iconleft}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <View style={styles.newProvidersBadge}>
              <Text style={styles.badgeText}>new providers</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Image
              source={require("../../assets/images/r.png")}
              style={styles.recommendedImage}
            />
            <Image
              source={require("../../assets/images/r1.jpg")}
              style={styles.recommendedImage}
            />
          </ScrollView>
        </View>
      </ScrollView>

      {/* <View style={styles.bottomNav}>
        <NavItem
          icon="home"
          text="Home"
          active
          navigation={navigation}
          targetScreen="HomePage"
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
          navigation={navigation}
          targetScreen="Profile"
        />
      </View> */}
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
}

const ServiceItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.serviceItem} onPress={onPress}>
    <MaterialIcons name={icon} size={24} color="#666" />
    <Text style={styles.serviceText}>{text}</Text>
  </TouchableOpacity>
);

// const NavItem = ({ icon, text, active, navigation, targetScreen }) => (
//   <TouchableOpacity
//     style={styles.navItem}
//     onPress={() => navigation.navigate(targetScreen)}
//   >
//     <Ionicons name={icon} size={34} color={active ? "red" : "#666"} />
//     <Text style={[styles.navText, active && styles.activeNavText]}>{text}</Text>
//   </TouchableOpacity>
// );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "#fff",
    borderWidth: 3,
  },
  greeting: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "DM",
    backgroundColor: "#7972D6",
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 20,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  icon: {
    backgroundColor: "#7972D6",
    borderRadius: 50,
    padding: 5,
  },
  banner: {
    padding: 20,
    paddingTop: 0,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 20,
    gap: 20,
  },
  discountText: {
    fontSize: 64,
    color: "white",
    fontWeight: "500",
    fontFamily: "DM",
    marginRight: 10,
  },
  descriptionContainer: {
    flex: 1,
  },
  discountDescription: {
    color: "white",
    fontSize: 24,
    fontWeight: "500",
    fontFamily: "DM",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  welcomeText1: {
    fontSize: 24,
    fontWeight: "500",
    fontFamily: "DM",
    marginBottom: 15,
    color: "#4E46B4",
  },
  welcomeText2: {
    fontSize: 24,
    fontWeight: "500",
    fontFamily: "DM",
    marginBottom: 15,
    color: "#0000008F",
  },
  newOrderButton: {
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 70,
    width: "55%",
  },
  newOrderText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "DM",
    color: "white",
    marginLeft: 5,
  },
  servicesSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "DM",
    color: "#0000008F",
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "DM",
    color: "#4E46B4",
  },
  servicesScroll: {
    flexDirection: "row",
  },
  gridItem: {
  flexBasis: '25%',   // 4 columns
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 10,
},
iconBox: {
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#E0E0E0",
  borderRadius: 12,
  width: 60,
  height: 60,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 2,
},
gridItemText: {
  fontSize: 12,
  color: "#000",
  marginTop: 6,
  textAlign: "center",
},

  //   gridItem: {
  //   flex: 1,
  //   alignItems: "center",
  //   marginVertical: 12,
  // },
  // gridItemText: {
  //   fontSize: 12,
  //   color: "#000",
  //   marginTop: 6,
  //   textAlign: "center",
  // },
  serviceItem: {
    padding: 15,
    borderColor: "#E2E2E2",
    borderWidth: 2,
    borderRadius: 70,
    marginRight: 10,
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  serviceText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "DM",
    color: "#000",
    marginLeft: 5,
  },
  upcomingSection: {
    padding: 20,
  },
  upcomingCard: {
    borderColor: "#E2E2E2",
    borderWidth: 2,
    borderRadius: 24,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginRight: 10,
  },
  upcomingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  upcomingDetails: {
    marginLeft: 10,
  },
  upcomingTitle: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "DM",
  },
  upcomingLocation: {
    color: "#666",
    fontWeight: "500",
    fontFamily: "DM",
  },
  upcomingTime: {
    color: "#5D5FEF",
    fontWeight: "500",
    fontFamily: "DM",
  },
  recommendedSection: {
    padding: 20,
  },
  newProvidersBadge: {
    backgroundColor: "#5D5FEF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  recommendedImage: {
    width: 250,
    height: 150,
    borderRadius: 15,
    marginRight: 15,
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
    color: "red",
  },
  iconleft: {
    padding: 4,
    borderRadius: 30,
    backgroundColor: "#4E46B4",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginLeft: 10,
  },
});
