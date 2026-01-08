// Route configuration - optimized with lazy loading
// Components are loaded on-demand when first accessed
export const routes = {
  // Auth & Onboarding
  Login: { component: () => require('../components/SignUps/Login').default },
  SignIn: { component: () => require('../components/SignUps/SignIn').default },
  SignUp: { component: () => require('../components/SignUps/SignUp').default },
  SignUpPhone: { component: () => require('../components/SignUps/SignUpPhone').default },
  ForgotPassword: { component: () => require('../components/SignUps/ForgotPassword').default },
  ResetPassword: { component: () => require('../components/SignUps/ResetPassword').default },
  PasswordChanged: { component: () => require('../components/SignUps/PasswordChanged').default },
  SendOtp: { component: () => require('../components/SignUps/SendOtp').default },
  OtpVerified: { component: () => require('../components/SignUps/OtpVerified').default },
  EmailVerify: { component: () => require('../components/SignUps/EmailVerify').default },
  WelcomeScreen: { component: () => require('../components/WelcomeSetUp/WelcomeScreen').default },
  WelcomeScreen2: { component: () => require('../components/WelcomeSetUp/WelcomeScreen2').default },

  // Main Screens
  Homepage: { component: () => require('../components/Homepage/Homepage').default },
  SearchPage: { component: () => require('../components/Homepage/SearchPage').default },
  ProviderList: { component: () => require('../components/Homepage/ProviderList').default },
  ProviderDetails: { component: () => require('../components/Homepage/ProviderDetails').default },
  HamburgerMenu: { component: () => require('../components/Homepage/HamburgerMenu').default },
  
  // Location
  LocationPicker: { component: () => require('../components/Location/LocationPicker').default },
  MapLocationPicker: { component: () => require('../components/Location/MapLocationPicker').default },

  // Profile
  Profile: { component: () => require('../components/Profile/Profile').default },
  UserProfile: { component: () => require('../components/Profile/UserProfile').default },
  ProfileVerify: { component: () => require('../components/Profile/ProfileVerify').default },
  Review: { component: () => require('../components/Profile/Review').default },
  ReviewList: { component: () => require('../components/Profile/ReviewList').default },

  // Services
  ServicesCard: { component: () => require('../components/Services/ServicesCard').default },
  SearchResult: { component: () => require('../components/Services/SearchResult').default },
  EngineRepairDetail: { component: () => require('../components/Services/EngineRepairDetail').default },
  BookSlot: { component: () => require('../components/Services/BookSlot').default },
  ReviewPage: { component: () => require('../components/Services/ReviewPage').default },
  BookingConfirmation: { component: () => require('../components/Services/BookingConfirmation').default },
  Filters: { component: () => require('../components/Services/Filters').default },

  // Payments
  Payment1: { component: () => require('../components/PaymentMethods/Payment1').default },
  Payment2: { component: () => require('../components/PaymentMethods/Payment2').default },
  Payment3: { component: () => require('../components/PaymentMethods/Payment3').default },
  Payment4: { component: () => require('../components/PaymentMethods/Payment4').default },
  Payment5: { component: () => require('../components/PaymentMethods/Payment5').default },
  PaymentSuccess: { component: () => require('../components/PaymentMethods/PaymentSuccess').default },
  PaymentConfirmation: { component: () => require('../components/PaymentMethods/PaymentConfirmation').default },

  // Bookings
  BookingList: { component: () => require('../components/Bookings/BookingList').default },
  BookingDetails: { component: () => require('../components/Bookings/BookingDetails').default },
  EditBooking: { component: () => require('../components/Bookings/EditBooking').default },
  CancelBooking: { component: () => require('../components/Bookings/CancelBooking').default },
  RescheduleBooking: { component: () => require('../components/Bookings/RescheduleBooking').default },
  RescheduledBooking: { component: () => require('../components/Bookings/RescheduledBooking').default },

  // Support
  Support: { component: () => require('../components/Support&Help/Support').default },
  FAQScreen: { component: () => require('../components/Support&Help/FAQScreen').default },
  Help: { component: () => require('../components/Support&Help/Help').default },
  CustomerSupport: { component: () => require('../components/Support&Help/CustomerSupport').default },
  Feedback: { component: () => require('../components/Support&Help/Feedback').default },
  ChatSupport: { component: () => require('../components/Support&Help/ChatSupport').default },

  // Update Payment
  UpdatePayment: { component: () => require('../components/UpdatePayment/UpdatePayment').default },
  UpdatePayment2: { component: () => require('../components/UpdatePayment/UpdatePayment2').default },
  UpdatePayment3: { component: () => require('../components/UpdatePayment/UpdatePayment3').default },
  ConfirmUpdate: { component: () => require('../components/UpdatePayment/ConfirmUpdate').default },

  // Security
  Security: { component: () => require('../components/Security/Security').default },
  ChangePassword: { component: () => require('../components/Security/ChangePassword').default },
  ChangePassword1: { component: () => require('../components/Security/ChangePassword1').default },
  PasswordReseted: { component: () => require('../components/Security/PasswordReseted').default },
  TwoFactorAuth: { component: () => require('../components/Security/TwoFactorAuth').default },
  TwoFactorAuthOFF: { component: () => require('../components/Security/TwoFactorAuthOFF').default },
  EnableTwoFactor: { component: () => require('../components/Security/EnableTwoFactor').default },
  TwoFactorConfirm: { component: () => require('../components/Security/TwoFactorConfirm').default },
  AddEmail: { component: () => require('../components/Security/AddEmail').default },
  PrivacyPolicy: { component: () => require('../components/Security/PrivacyPolicy').default },

  // Other
  Notification: { component: () => require('../components/Notification/Notification').default },
  ScreenTester: { component: () => require('../components/TestScreens/ScreenTester').default },
};