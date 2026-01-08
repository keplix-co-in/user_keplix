/**
 * KEPLIX USER-SIDE API INTEGRATION
 * ==================================
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
const BASE_URL = 'http://192.168.1.8:8000';

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

    if (error.response?.status === 401 && !originalRequest._retry) {
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
  getProfile: () => api.get('/accounts/profile/'),
  updateProfile: (profileData) => api.put('/accounts/profile/', profileData),
  
  // OTP
  sendPhoneOTP: (phoneNumber) => 
    api.post('/accounts/auth/send-phone-otp/', { phone_number: phoneNumber }),
  
  verifyPhoneOTP: (phoneNumber, otp) => 
    api.post('/accounts/auth/verify-phone-otp/', { phone_number: phoneNumber, otp }),
  
  sendEmailOTP: (email) => 
    api.post('/accounts/auth/send-email-otp/', { email }),
  
  verifyEmailOTP: (email, otp) => 
    api.post('/accounts/auth/verify-email-otp/', { email, otp }),
  
  // Password Reset
  forgotPassword: (email) => api.post('/accounts/auth/forgot-password/', { email }),
  
  resetPasswordWithOTP: (email, otp, newPassword) => 
    api.post('/accounts/auth/reset-password-otp/', { email, otp, password: newPassword }),
  
  // Change Password (requires authentication)
  changePassword: (currentPassword, newPassword) => 
    api.post('/accounts/auth/change-password/', { current_password: currentPassword, new_password: newPassword }),
  
  // Logout
  logout: async () => {
    const refreshToken = await tokenManager.getRefreshToken();
    return api.post('/accounts/auth/logout/', { refresh: refreshToken });
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
  
  // Update booking (reschedule, cancel, etc.)
  updateBooking: (userId, bookingId, bookingData) => 
    api.put(`/service_api/user/${userId}/bookings/update/${bookingId}`, bookingData),
  
  // Get booking details
  getBookingDetails: (bookingId) => 
    api.get(`/service_api/user/bookings/${bookingId}`),
};

// ======================
// 4. PAYMENTS APIs
// ======================

export const paymentsAPI = {
  // Create payment for booking
  createPayment: (bookingId, paymentData) => 
    api.post(`/service_api/bookings/${bookingId}/payment/create/`, paymentData),
  
  // Get payment details
  getPaymentDetails: (paymentId) => 
    api.get(`/service_api/payments/${paymentId}/`),
  
  // Get payment by booking
  getPaymentByBooking: (bookingId) => 
    api.get(`/service_api/bookings/${bookingId}/payment/`),
  
  // Verify payment
  verifyPayment: (paymentData) => 
    api.post(`/service_api/payments/verify/`, paymentData),
  
  // Get user's payment history
  getUserPayments: (userId) => 
    api.get(`/service_api/user/${userId}/payments/`),
};

// ======================
// 5. REVIEWS & FEEDBACK APIs
// ======================

export const reviewsAPI = {
  // Get reviews (filter by vendor, user, rating)
  getReviews: (filters = {}) => 
    api.get('/interactions/reviews/', { params: filters }),
  
  // Create review
  createReview: (reviewData) => 
    api.post('/interactions/reviews/create/', reviewData),
  
  // Get review details
  getReviewDetails: (reviewId) => 
    api.get(`/interactions/reviews/${reviewId}/`),
  
  // Update review
  updateReview: (reviewId, reviewData) => 
    api.put(`/interactions/reviews/${reviewId}/update/`, reviewData),
  
  // Delete review
  deleteReview: (reviewId, userId) => 
    api.delete(`/interactions/reviews/${reviewId}/delete/`, { data: { user_id: userId } }),
};

export const feedbackAPI = {
  // Get user's feedback
  getUserFeedback: (userId) => 
    api.get('/interactions/feedback/', { params: { user_id: userId } }),
  
  // Create feedback
  createFeedback: (feedbackData) => 
    api.post('/interactions/feedback/', feedbackData),
  
  // Get feedback details
  getFeedbackDetails: (feedbackId) => 
    api.get(`/interactions/feedback/${feedbackId}/`),
};

// ======================
// 6. NOTIFICATIONS APIs
// ======================

export const notificationsAPI = {
  // Get user's notifications
  getUserNotifications: (userId) => 
    api.get(`/interactions/users/${userId}/notifications/`),
  
  // Mark notification as read
  markNotificationRead: (notificationId) => 
    api.put(`/interactions/notifications/${notificationId}/mark-read/`),
  
  // Mark all notifications as read
  markAllNotificationsRead: (userId) => 
    api.put(`/interactions/users/${userId}/notifications/mark-all-read/`),
};

// ======================
// 7. CHAT/MESSAGING APIs
// ======================

export const chatAPI = {
  // Get conversation by booking
  getConversation: (bookingId) => 
    api.get(`/interactions/conversations/${bookingId}/`),
  
  // Create conversation
  createConversation: (bookingId) => 
    api.post(`/interactions/conversations/${bookingId}/create/`),
  
  // Get messages
  getMessages: (conversationId) => 
    api.get(`/interactions/messages/${conversationId}/`),
  
  // Send message
  sendMessage: (conversationId, messageData) => 
    api.post(`/interactions/messages/${conversationId}/send/`, messageData),
};

// Export the configured axios instance
export default api;
