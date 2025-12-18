// // export default ServicesCard;
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  FontAwesome5,
} from "@expo/vector-icons";
import { servicesAPI } from '../../services/api';
// 🔻 CategoryToggle pill component
const CategoryToggle = ({ iconName, title, description, isExpanded, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="w-full flex-row justify-between items-center mb-4 bg-white rounded-2xl border border-[#E8E8E8] py-5 px-4"
  >
    <View className="flex-row items-center flex-1 gap-3">
      <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center">
        <Ionicons name={iconName} size={24} color="#374151" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold font-dm text-gray-900">{title}</Text>
        <Text className="text-sm font-dm text-gray-500 mt-0.5">{description}</Text>
      </View>
    </View>
    <View className={`w-9 h-9 rounded-full items-center justify-center ${isExpanded ? 'bg-red-600' : 'bg-gray-100'}`}>
      <Ionicons
        name={isExpanded ? "chevron-up" : "chevron-down"}
        size={20}
        color={isExpanded ? "#FFF" : "#374151"}
      />
    </View>
  </TouchableOpacity>
);

// 🔻 Category Grid Section
const CategorySection = ({ title, items, navigation }) => (
  <View className="mb-6 px-1">
    <View className="flex-row flex-wrap justify-between">
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          className="flex-col w-[31%] bg-white border border-[#E8E8E8] p-4 rounded-2xl items-center mb-3"
          onPress={() => navigation.navigate("ProviderList")}
        >
          {item.icon}
          <Text className="mt-2 text-sm font-semibold font-dm text-gray-900 text-center">{item.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// 🔻 Bottom Navigation Item
const NavItem = ({ icon, text, active, navigation, targetScreen }) => (
  <TouchableOpacity
    className="items-center"
    onPress={() => navigation.navigate(targetScreen)}
  >
    <Ionicons name={icon} size={34} color={active ? "#DC2626" : "#666"} />
    <Text className={`text-xs mt-1.5 ${active ? 'text-[#DC2626]' : 'text-[#666]'}`}>{text}</Text>
  </TouchableOpacity>
);

// 🔻 Main Screen Component
export default function ServicesCard({ navigation }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({
    cleaning: [],
    repairs: [],
    inspection: []
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAllServices();
      if (response.data) {
        setServices(response.data);
        categorizeServices(response.data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      // Fallback to hardcoded services if API fails
      setDefaultServices();
    } finally {
      setLoading(false);
    }
  };

  const categorizeServices = (servicesData) => {
    const cleaning = servicesData.filter(s => 
      s.category?.toLowerCase() === 'cleaning' || 
      s.name?.toLowerCase().includes('wash') || 
      s.name?.toLowerCase().includes('clean')
    );
    
    const repairs = servicesData.filter(s => 
      s.category?.toLowerCase() === 'repairs' || 
      s.name?.toLowerCase().includes('repair') || 
      s.name?.toLowerCase().includes('engine') ||
      s.name?.toLowerCase().includes('brake')
    );
    
    const inspection = servicesData.filter(s => 
      s.category?.toLowerCase() === 'inspection' || 
      s.name?.toLowerCase().includes('check') || 
      s.name?.toLowerCase().includes('inspection')
    );

    setCategories({ cleaning, repairs, inspection });
  };

  const setDefaultServices = () => {
    // Fallback hardcoded services
    const repairItems = [
      {
        icon: <MaterialCommunityIcons name="engine" size={34} color="#000" />,
        text: "Engine",
        id: 'engine-1'
      },
      { icon: <Ionicons name="disc" size={34} color="#000" />, text: "Brakes", id: 'brakes-1' },
      {
        icon: <FontAwesome5 name="cogs" size={34} color="#000" />,
        text: "Gearbox",
        id: 'gearbox-1'
      },
    ];

    const cleaningItems = [
      {
        icon: <Ionicons name="water" size={34} color="#000" />,
        text: "Car Wash",
        id: 'carwash-1'
      },
      {
        icon: <Ionicons name="water" size={34} color="#000" />,
        text: "Foam Wash",
        id: 'foamwash-1'
      },
      { icon: <Ionicons name="car" size={34} color="#000" />, text: "Interior", id: 'interior-1' },
    ];

    const inspectionItems = [
      {
        icon: <Ionicons name="search" size={34} color="#000" />,
        text: "Check Engine",
        id: 'check-1'
      },
      {
        icon: <Ionicons name="speedometer" size={34} color="#000" />,
        text: "Performance",
        id: 'performance-1'
      },
      { icon: <Ionicons name="alert" size={34} color="#000" />, text: "Safety", id: 'safety-1' },
    ];

    setCategories({
      cleaning: cleaningItems,
      repairs: repairItems,
      inspection: inspectionItems
    });
  };

  const getServiceIcon = (serviceName) => {
    const name = serviceName.toLowerCase();
    if (name.includes('engine')) return <MaterialCommunityIcons name="engine" size={34} color="#000" />;
    if (name.includes('brake')) return <Ionicons name="disc" size={34} color="#000" />;
    if (name.includes('gear')) return <FontAwesome5 name="cogs" size={34} color="#000" />;
    if (name.includes('wash')) return <Ionicons name="water" size={34} color="#000" />;
    if (name.includes('interior')) return <Ionicons name="car" size={34} color="#000" />;
    if (name.includes('check')) return <Ionicons name="search" size={34} color="#000" />;
    if (name.includes('performance')) return <Ionicons name="speedometer" size={34} color="#000" />;
    if (name.includes('safety')) return <Ionicons name="alert" size={34} color="#000" />;
    return <Ionicons name="construct" size={34} color="#000" />;
  };

  const formatServiceItems = (servicesList) => {
    return servicesList.map(service => ({
      icon: getServiceIcon(service.name || service.text),
      text: service.name || service.text,
      id: service.id,
      ...service
    }));
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="mt-4 text-base text-[#666] font-['DM']">Loading services...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-5" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View className="flex-row items-center justify-between mb-5">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-gray-900 font-dm">Services</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("SearchPage")}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="search-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <CategoryToggle
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
            items={formatServiceItems(categories.cleaning)}
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
            items={formatServiceItems(categories.repairs)}
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
            items={formatServiceItems(categories.inspection)}
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
    </SafeAreaView>
  );
}
