// services/googleAuth.js
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import api from './api';
import { tokenManager } from './tokenManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Configure Google Sign-In
 * You MUST put your webClientId from the Firebase Console here.
 * Even though it's a mobile app, you use the "Web Client ID" for the token exchange to work with the backend.
 */
const WEB_CLIENT_ID = '809881454621-iletlppro4r5i4uf4njcsria3jio7l7p.apps.googleusercontent.com'; 

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
});

export const googleAuthService = {
  
  /**
   * Initiates the Google Sign-In flow
   * @returns {Promise<Object>} The user data and tokens from your backend
   */
  signIn: async () => {
    try {
      // 1. Check if play services are available
      await GoogleSignin.hasPlayServices();
      
      // 2. Prompt the user to sign in
      const userInfo = await GoogleSignin.signIn();
      
      // Handle different library versions (some return {data}, some return object directly)
      const idToken = userInfo.data?.idToken || userInfo.idToken;

      if (!idToken) {
        console.error('Google Sign-In Info:', JSON.stringify(userInfo));
        throw new Error('No ID token obtained from Google');
      }

      console.log('Got Google ID Token (starts with):', idToken.substring(0, 20));

      // 3. Send the ID Token to your Django Backend
      const response = await api.post('/accounts/auth/google/', {
        token: idToken
      });

      console.log('Backend verified Google Login:', response.data);

      const { refresh, access, user } = response.data;

      // 4. Save the Django tokens (Session is now established)
      await tokenManager.setAccessToken(access);
      await tokenManager.setRefreshToken(refresh);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));

      return user;

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('User cancelled Google Sign-In');
        return null; // Silent return
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('Google Sign-In in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.error('Play Services not available');
        throw new Error('Google Play Services required');
      } else {
        // some other error happened
        if (error.response) {
          console.error('Google Sign-In Backend Error Data:', error.response.data);
          console.error('Google Sign-In Backend Status:', error.response.status);
        }
        console.error('Google Sign-In Error:', error.message);
        throw error;
      }
    }
  },

  /**
   * Signs out from Google (and preferably your backend too)
   */
  signOut: async () => {
    try {
      await GoogleSignin.signOut();
      // Also clear local storage/tokens
      await tokenManager.clearTokens();
    } catch (error) {
      console.error('Google Sign-Out Error:', error);
    }
  }
};
