import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import Footer from '../Footer/Footer';
export default function BookingList ({ navigation }) {
  const [activeTab, setActiveTab] = useState('past');

  const bookings = [
    {
      id: 1,
      image: require('../../assets/images/p1.png'),
      service: 'Engine Repair',
      location: 'Dwarka mor service',
      date: '26 June 2024',
      time: '4:30PM',
      price: '₹10,499'
    },
    {
      id: 2,
      image: require('../../assets/images/b1.jpg'),
      service: 'Engine Repair',
      location: 'Dwarka mor service',
      date: '26 June 2024',
      time: '4:30PM',
      price: '₹8,499'
    },
    {
      id: 3,
      image: require('../../assets/images/p2.png'),
      service: 'Engine Repair',
      location: 'Dwarka mor service',
      date: '26 June 2024',
      time: '4:30PM',
      price: '₹12,499'
    },
  ];

  const BookingCard = ({ booking }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image source={booking.image} style={styles.image} />
          <View style={styles.iconOverlay}>
            <MaterialCommunityIcons name="engine" size={28} color="#fff" />
          </View>
        </View>
        <View style={styles.bookingInfo} >
          <Text style={styles.serviceTitle}>{booking.service}</Text>
          <Text style={styles.locationText}>{booking.location}</Text>
          <Text style={styles.dateText}>{`${booking.date} • ${booking.time}`}</Text>
          <Text style={styles.priceText}>{booking.price}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate('BookingDetails')}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditBooking')}>
          <Text style={styles.editButtonText}>Edit Booking</Text>
          <Ionicons name="pencil" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const NavItem = ({ icon, text, active, navigation, targetScreen }) => (
    <TouchableOpacity 
      style={styles.navItem} 
      onPress={() => navigation.navigate(targetScreen)}
    >
      <Ionicons 
        name={icon} 
        size={34} 
        color={active ? "#4E46B4" : "#666"} 
      />
      <Text style={[styles.navText, active && styles.activeNavText]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name={"arrow-back-outline"} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> navigation.navigate("HamburgerMenu")}>
              <Ionicons name="menu-outline" style={styles.icon} />
              </TouchableOpacity>
            </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past bookings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date and Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.dateLabel}>20 Sept, Today</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="search" size={20} color="black" style={styles.icon1}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="black" style={styles.icon1}/>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bookings List */}
      <ScrollView style={styles.bookingsList}>
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
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
          navigation={navigation} 
          targetScreen="ServicesCard" 
        />
        <NavItem 
          icon="document-text" 
          text="Bookings" 
          active 
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap:"75%",
  },
  icon: {
    fontSize: 30,
    borderColor: "#E2E2E2",
    borderWidth: 2,
    borderRadius: 50,
    padding: 5,
  },
  icon1: {
    borderColor: "#E2E2E2",
    borderWidth: 2,
    borderRadius: 50,
    padding: 5,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap:80,
    marginBottom: 20,
  },
  tab: {
    marginRight: 20,
    paddingBottom: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'red',
  },
  tabText: {
    fontSize: 16,
    color: '#0000008F',
    fontWeight: "500",
    fontFamily: "DM",
  },
  activeTabText: {
    color: 'red',
    fontWeight: '500',
    fontFamily: "DM",
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: "DM",
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
  },
  bookingsList: {
    flex: 1,
  },
  card: {
    backgroundColor: '#E2E2E2',
    borderColor: "#E2E2E2",
    borderWidth: 2,
    borderRadius: 16,
    marginBottom: 20,
    padding: 15,
  },
  cardContent: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding:10,
    margin:-12,
    borderRadius: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 140,
    height: 100,
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  iconOverlay: {
    position: 'absolute',
    backgroundColor:  'rgba(177, 176, 176, 0.56)',
    borderColor: "#E2E2E2",
    borderWidth: 2,
    borderRadius: 20,
    padding: 5,
    top: 20,
    left: 50,
  },
  bookingInfo: {
    flex: 1, 
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: "DM",
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#696969',
    fontWeight: '500',
    fontFamily: "DM",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
    fontFamily: "DM",
    marginBottom: 5,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: "DM",
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopColor: '#F0F0F0',
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: "DM",
    borderBottomWidth:1
  },
  editButton: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: "DM",
    color: '#fff',
    marginRight: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  activeNavItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#0000008F',
    fontWeight: '500',
    fontFamily: "DM",
    marginTop: 5,
  },
  activeNavText: {
    fontSize: 14,
    color: '#4E46B4',
    fontWeight: '500',
    fontFamily: "DM",
    marginTop: 5,
  },
});

