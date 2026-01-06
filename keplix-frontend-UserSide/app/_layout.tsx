import "../global.css";
import React, { useMemo, memo, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import { routes } from "./routes.config";
import Footer from "../components/Footer/Footer";
import { tokenManager } from "../services/tokenManager";

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

      setCurrentRoute(name);

      const unsubscribe = props.navigation.addListener('focus', () => {
        setCurrentRoute(name);
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

  const [currentRoute, setCurrentRoute] = useState('Login');
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const navigationRef = React.useRef<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await tokenManager.getAccessToken();
        console.log('App Launch - Auth Token:', token ? 'Found' : 'Not Found');
        setInitialRoute(token ? 'Homepage' : 'Login');
        if (token) setCurrentRoute('Homepage');
      } catch (error) {
        console.error('Auth Check Error:', error);
        setInitialRoute('Login');
      }
    };
    checkAuth();
  }, []);

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
          name={name}
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

  if (!fontsLoaded || !initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  const shouldShowFooter = FOOTER_SCREENS.includes(currentRoute);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        id="RootStack"
        screenOptions={screenOptions}
        initialRouteName={initialRoute}
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
