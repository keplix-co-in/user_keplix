import "../global.css";
import React, { useMemo, memo } from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import { routes } from "./routes.config";
import Footer from "../components/Footer/Footer";

const Stack = createStackNavigator();

// Screens that should show the footer
const FOOTER_SCREENS = ['Homepage', 'ServicesCard', 'BookingList', 'Profile'];

// Memoize screen wrapper to prevent unnecessary re-creation
const createScreenWrapper = (
  ScreenComponent: any,
  name: string,
  setCurrentRoute: (route: string) => void,
  navigationRef: React.MutableRefObject<any>
) => {
  return memo((props: any) => {
    React.useEffect(() => {
      // Store navigation ref for Footer
      if (props.navigation && !navigationRef.current) {
        navigationRef.current = props.navigation;
      }

      const screenName = name === 'Login' ? 'Home' : name;
      setCurrentRoute(screenName);

      const unsubscribe = props.navigation.addListener('focus', () => {
        setCurrentRoute(screenName);
      });

      return unsubscribe;
    }, [props.navigation]);

    return <ScreenComponent {...props} />;
  });
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "DM": require('./../assets/fonts/DMSans-VariableFont_opsz,wght.ttf')
  });

  const [currentRoute, setCurrentRoute] = React.useState('Home');
  const navigationRef = React.useRef<any>(null);

  // Memoize screen options to prevent re-creation
  const screenOptions = useMemo(() => ({
    headerShown: false,
    cardStyle: { backgroundColor: 'transparent' },
  }), []);

  // Memoize routes array to prevent re-mapping on every render
  const routeScreens = useMemo(() => {
    return Object.entries(routes).map(([name, config]) => {
      const ScreenComponent = config.component();
      const WrappedComponent = createScreenWrapper(ScreenComponent, name, setCurrentRoute, navigationRef);

      return (
        <Stack.Screen
          key={name}
          name={name === 'Login' ? 'Home' : name}
          component={WrappedComponent}
        />
      );
    });
  }, []);

  // Debug logs - MUST be before early return
  React.useEffect(() => {
    console.log('Current Route:', currentRoute);
    console.log('Should Show Footer:', FOOTER_SCREENS.includes(currentRoute));
    console.log('Navigation Ref:', navigationRef.current ? 'Available' : 'Not Available');
  }, [currentRoute]);

  if (!fontsLoaded) {
    return null;
  }

  const shouldShowFooter = FOOTER_SCREENS.includes(currentRoute);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName="ScreenTester"
      >
        {routeScreens}
      </Stack.Navigator>

      {/* Persistent Footer - rendered once at root level */}
      {shouldShowFooter && navigationRef.current && (
        <Footer navigation={navigationRef.current} currentRoute={currentRoute} />
      )}
    </View>
  );
}
