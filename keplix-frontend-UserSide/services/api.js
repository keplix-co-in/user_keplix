/**
 * KEPLIX USER-SIDE API INTEGRATION
 * ================================
 * 
 * BASE URL: http://localhost:8000 (Backend Django Server)
 * 
 * USER-SIDE APIs:
 * 1. Authentication & Profile
 * 2. Services (Browse & Search)
 * 3. Bookings (Create, View, Update, Cancel)
 * 4. Payments
 * 5. Reviews & Feedback
 * 6. Notifications
 * 7. Chat/Messaging
 */

import axios from 'axios';
import { tokenManager } from './tokenManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend URL - Configure in .env file
const BASE_URL = 'https://untyped-ed-xenogenic.ngrok-free.dev';

// Debug: Log the API URL being used
console.log('🔗 API BASE_URL:', BASE_URL);
console.log('📱 Environment:', process.env.EXPO_PUBLIC_API_URL);

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: function (status) {
    // Accept all 2xx status codes as success
    return status >= 200 && status < 300;
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for login, signup, and OTP endpoints
    const isAuthRequest = originalRequest.url.includes('/accounts/auth/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenManager.getRefreshToken();
        if (!refreshToken) {
          await tokenManager.clearTokens();
          await AsyncStorage.removeItem('user_data');
          return Promise.reject(new Error('No refresh token available'));
        }
        
        const response = await axios.post(`${BASE_URL}/accounts/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        await tokenManager.setAccessToken(access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        await tokenManager.clearTokens();
        await AsyncStorage.removeItem('user_data');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ======================
// 1. AUTHENTICATION APIs
// ======================

export const authAPI = {
  // Sign up
  signup: (userData) => api.post('/accounts/auth/signup/', userData),
  
  // Login
  login: (credentials) => api.post('/accounts/auth/login/', credentials),
  
  // Profile
  getProfile: () => api.get('/accounts/auth/profile'), // Fixed
  updateProfile: (profileData) => {
    // TODO: Backend Missing Update Profile Endpoint
    console.warn("Update Profile not implemented in backend correctly yet");
    return Promise.resolve({ data: {} }); 
    // api.put('/accounts/auth/profile', profileData)
  },
  
  // OTP
  sendPhoneOTP: (phoneNumber) => 
    api.post('/accounts/auth/send-phone-otp', { phone_number: phoneNumber }),
  
  verifyPhoneOTP: (phoneNumber, otp) => 
    api.post('/accounts/auth/verify-phone-otp', { phone_number: phoneNumber, otp }),
  
  sendEmailOTP: (email) => 
    api.post('/accounts/auth/send-email-otp', { email }),
  
  verifyEmailOTP: (email, otp) => 
    api.post('/accounts/auth/verify-email-otp', { email, otp }),
  
  // Password Reset
  forgotPassword: (email) => api.post('/accounts/auth/password/forgot', { email }),
  
  resetPasswordWithOTP: (email, otp, newPassword) => 
    api.post('/accounts/auth/reset-password-otp', { email, otp, password: newPassword }),
  
  // Logout
  logout: async () => {
    const refreshToken = await tokenManager.getRefreshToken();
    return api.post('/accounts/auth/logout', { refresh: refreshToken });
  },
};

// ======================
// 2. SERVICES APIs
// ======================

export const servicesAPI = {
  // Get all services
  getAllServices: (params = {}) => api.get('/service_api/user/services', { params }),
  
  // Get service details
  getServiceDetail: (serviceId) => api.get(`/service_api/user/services/${serviceId}`),
  
  // Search services with optional filters
  searchServices: (query, filters = {}) => 
    api.get('/service_api/user/services', { 
      params: { search: query, ...filters } 
    }),
};

// ======================
// 3. BOOKINGS APIs
// ======================

export const bookingsAPI = {
  // Get user's bookings
  getUserBookings: (userId) => api.get(`/service_api/user/${userId}/bookings`),
  
  // Create new booking
  createBooking: (userId, bookingData) => 
    api.post(`/service_api/user/${userId}/bookings/create`, bookingData),
  
  // Update booking - NOT IMPLEMENTED IN BACKEND
  updateBooking: (userId, bookingId, bookingData) => {
      console.warn("updateBooking not available in backend");
      return Promise.reject("Not Implemented");
      // api.put(`/service_api/user/${userId}/bookings/update/${bookingId}`, bookingData),
  },

  // Get booking details - NOT IMPLEMENTED IN BACKEND
  getBookingDetails: (bookingId) => {
      console.warn("getBookingDetails not available in backend");
      return Promise.reject("Not Implemented");
     // api.get(`/service_api/user/bookings/${bookingId}`),
  }
};

// ======================
// 4. PAYMENTS APIs
// ======================

export const paymentsAPI = {
  // Create payment order (Razorpay/Stripe)
  createPayment: (bookingId, paymentData) => 
    api.post(`/service_api/payments/order/create`, paymentData), // Fixed endpoint
  
  // Verify payment
  verifyPayment: (paymentData) => 
    api.post(`/service_api/payments/verify`, paymentData), // Fixed endpoint
  
  // Get user's payment history
  getUserPayments: (userId) => 
    api.get(`/service_api/user/${userId}/payments`), // Fixed endpoint

  // Get payment details - NOT IMPLEMENTED
  getPaymentDetails: (paymentId) => Promise.reject("Not Implemented"),
  
  // Get payment by booking - NOT IMPLEMENTED
  getPaymentByBooking: (bookingId) => Promise.reject("Not Implemented"),
};

// ======================
// 5. REVIEWS & FEEDBACK APIs
// ======================

export const reviewsAPI = {
  // Get reviews
  getReviews: (filters = {}) => 
    api.get('/interactions/api/reviews', { params: filters }), // Fixed Prefix
  
  // Create review
  createReview: (reviewData) => 
    api.post('/interactions/api/reviews/create', reviewData), // Fixed Prefix
  
  // Update/Delete/Details - NOT IMPLEMENTED
  getReviewDetails: (reviewId) => Promise.reject("Not Implemented"),
  updateReview: (reviewId, reviewData) => Promise.reject("Not Implemented"),
  deleteReview: (reviewId, userId) => Promise.reject("Not Implemented"),
};

export const feedbackAPI = {
  // Get user's feedback
  getUserFeedback: (userId) => 
    api.get('/interactions/api/feedback', { params: { user_id: userId } }), // Fixed Prefix
  
  // Create feedback
  createFeedback: (feedbackData) => 
    api.post('/interactions/api/feedback/create', feedbackData), // Fixed Prefix
  
  // Get feedback details - NOT IMPLEMENTED
  getFeedbackDetails: (feedbackId) => Promise.reject("Not Implemented"),
};

// ======================
// 6. NOTIFICATIONS APIs
// ======================

export const notificationsAPI = {
  // Get user's notifications
  getUserNotifications: (userId) => 
    api.get(`/interactions/api/users/${userId}/notifications`), // Fixed Prefix
  
  // Mark notification as read
  markNotificationRead: (notificationId) => 
    api.put(`/interactions/api/notifications/${notificationId}/mark-read`), // Fixed Prefix
  
  // Mark all notifications as read - NOT IMPLEMENTED
  markAllNotificationsRead: (userId) => Promise.reject("Not Implemented"),

  // Save FCM Token
  updateFcmToken: (fcmToken) => 
    api.put('/interactions/api/users/fcm-token', { fcmToken })
};

// ======================
// 7. CHAT/MESSAGING APIs
// ======================

export const chatAPI = {
  // Get all conversations
  getConversations: () => 
    api.get(`/interactions/api/conversations`), // Fixed endpoint
  
  // Get messages
  getMessages: (conversationId) => 
    api.get(`/interactions/api/messages`, { params: { conversation_id: conversationId } }), // Fixed endpoint
  
  // Create conversation/Send message - NOT IMPLEMENTED VIA REST (Use Socket)
  createConversation: (bookingId) => Promise.resolve({}), // Usually auto-created by booking
  sendMessage: (conversationId, messageData) => Promise.reject("Use Socket.io"),
};


// Export the configured axios instance
export default api;
