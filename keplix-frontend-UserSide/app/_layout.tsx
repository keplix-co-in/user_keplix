import "../global.css";
import {useFonts} from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "@/components/SignUps/Login";
import SignIn from "@/components/SignUps/SignIn";
import ForgotPassword from "@/components/SignUps/ForgotPassword";
import ResetPassword from "@/components/SignUps/ResetPassword";
import PasswordChanged from "@/components/SignUps/PasswordChanged";
import SignUp from "@/components/SignUps/SignUp";
import EmailVerify from "@/components/SignUps/EmailVerify";
import SignUpPhone from "@/components/SignUps/SignUpPhone";
import SendOtp from "@/components/SignUps/SendOtp";
import OtpVerified from "@/components/SignUps/OtpVerified";
import WelcomeScreen from "@/components/WelcomeSetUp/WelcomeScreen";
import WelcomeScreen2 from "@/components/WelcomeSetUp/WelcomeScreen2";
import Homepage from "@/components/Homepage/Homepage";
import SearchPage from "@/components/Homepage/SearchPage";
import ProviderList from "@/components/Homepage/ProviderList";
import ProviderDetails from "@/components/Homepage/ProviderDetails";
import Profile from "@/components/Profile/Profile";
import UserProfile from "@/components/Profile/UserProfile";
import ProfileVerify from "@/components/Profile/ProfileVerify";
import Review from "@/components/Profile/Review";
import ReviewList from "@/components/Profile/ReviewList";
import HamburgerMenu from "@/components/Homepage/HamburgerMenu";
import ServicesCard from "@/components/Services/ServicesCard";
import SearchResult from "@/components/Services/SearchResult";
import EngineRepairDetail from "@/components/Services/EngineRepairDetail";
import BookSlot from "@/components/Services/BookSlot";
import ReviewPage from "@/components/Services/ReviewPage";
import Payment1 from "@/components/PaymentMethods/Payment1"
import Payment2 from "@/components/PaymentMethods/Payment2"
import Payment3 from "@/components/PaymentMethods/Payment3"
import PaymentSuccess from "@/components/PaymentMethods/PaymentSuccess"
import PaymentConfirmation from "@/components/PaymentMethods/PaymentConfirmation"
import Payment4 from "@/components/PaymentMethods/Payment4"
import Payment5 from "@/components/PaymentMethods/Payment5"
import BookingConfirmation from "@/components/Services/BookingConfirmation"
import BookingList from "@/components/Bookings/BookingList"
import BookingDetails from "@/components/Bookings/BookingDetails"
import EditBooking from "@/components/Bookings/EditBooking"
import CancelBooking from "@/components/Bookings/CancelBooking"
import RescheduleBooking from "@/components/Bookings/RescheduleBooking"
import RescheduledBooking from "@/components/Bookings/RescheduledBooking"
import Support from "@/components/Support&Help/Support"
import FAQScreen from "@/components/Support&Help/FAQScreen"
import Help from "@/components/Support&Help/Help"
import CustomerSupport from "@/components/Support&Help/CustomerSupport"
import Feedback from "@/components/Support&Help/Feedback"
import UpdatePayment from "@/components/UpdatePayment/UpdatePayment"
import UpdatePayment2 from "@/components/UpdatePayment/UpdatePayment2"
import ConfirmUpdate from "@/components/UpdatePayment/ConfirmUpdate"
import UpdatePayment3 from "@/components/UpdatePayment/UpdatePayment3"
import Notification from "@/components/Notification/Notification"
import Security from "@/components/Security/Security"
import ChangePassword from "@/components/Security/ChangePassword"
import ChangePassword1 from "@/components/Security/ChangePassword1"
import PasswordReseted from "@/components/Security/PasswordReseted"
import TwoFactorAuth from "@/components/Security/TwoFactorAuth"
import EnableTwoFactor from "@/components/Security/EnableTwoFactor"
import AddEmail from "@/components/Security/AddEmail"
import TwoFactorConfirm from "@/components/Security/TwoFactorConfirm"
import TwoFactorAuthOFF from "@/components/Security/TwoFactorAuthOFF"
import Filters from "@/components/Services/Filters"
import ChatSupport from "@/components/Support&Help/ChatSupport"
import ScreenTester from "@/components/TestScreens/ScreenTester"

const Stack = createStackNavigator();

export default function RootLayout() {

 useFonts({
    "DM":require('./../assets/fonts/DMSans-VariableFont_opsz,wght.ttf')
  })
  

  return (
    
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={LoginScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="PasswordChanged" component={PasswordChanged} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="EmailVerify" component={EmailVerify} />
        <Stack.Screen name="SignUpPhone" component={SignUpPhone} />
        <Stack.Screen name="SendOtp" component={SendOtp} />
        <Stack.Screen name="OtpVerified" component={OtpVerified} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="WelcomeScreen2" component={WelcomeScreen2} />
        <Stack.Screen name="Homepage" component={Homepage} />
        <Stack.Screen name="SearchPage" component={SearchPage} />
        <Stack.Screen name="ProviderList" component={ProviderList} />
        <Stack.Screen name="ProviderDetails" component={ProviderDetails} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="ProfileVerify" component={ProfileVerify} />
        <Stack.Screen name="HamburgerMenu" component={HamburgerMenu} />
        <Stack.Screen name="ServicesCard" component={ServicesCard} />
        <Stack.Screen name="SearchResult" component={SearchResult} />
        <Stack.Screen name="EngineRepairDetail" component={EngineRepairDetail} />
        <Stack.Screen name="BookSlot" component={BookSlot} />
        <Stack.Screen name="ReviewPage" component={ReviewPage} />
        <Stack.Screen name="Payment1" component={Payment1} />
        <Stack.Screen name="Payment2" component={Payment2} />
        <Stack.Screen name="Payment3" component={Payment3} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
        <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmation} />
        <Stack.Screen name="Payment4" component={Payment4} />
        <Stack.Screen name="Payment5" component={Payment5} />
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmation} />
        <Stack.Screen name="BookingList" component={BookingList} />
        <Stack.Screen name="BookingDetails" component={BookingDetails} />
        <Stack.Screen name="EditBooking" component={EditBooking} />
        <Stack.Screen name="CancelBooking" component={CancelBooking} />
        <Stack.Screen name="RescheduleBooking" component={RescheduleBooking} />
        <Stack.Screen name="RescheduledBooking" component={RescheduledBooking} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="FAQScreen" component={FAQScreen} />
        <Stack.Screen name="Help" component={Help} />
        <Stack.Screen name="CustomerSupport" component={CustomerSupport} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="UpdatePayment" component={UpdatePayment} />
        <Stack.Screen name="UpdatePayment2" component={UpdatePayment2} />
        <Stack.Screen name="ConfirmUpdate" component={ConfirmUpdate} />
        <Stack.Screen name="UpdatePayment3" component={UpdatePayment3} />
        <Stack.Screen name="Review" component={Review} />
        <Stack.Screen name="ReviewList" component={ReviewList} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Security" component={Security} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ChangePassword1" component={ChangePassword1} />
        <Stack.Screen name="PasswordReseted" component={PasswordReseted} />
        <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuth} />
        <Stack.Screen name="EnableTwoFactor" component={EnableTwoFactor} />
        <Stack.Screen name="AddEmail" component={AddEmail} />
        <Stack.Screen name="TwoFactorConfirm" component={TwoFactorConfirm} />
        <Stack.Screen name="TwoFactorAuthOFF" component={TwoFactorAuthOFF} />
        <Stack.Screen name="Filters" component={Filters} />
        <Stack.Screen name="ChatSupport" component={ChatSupport} />
        <Stack.Screen name="ScreenTester" component={ScreenTester} />

        </Stack.Navigator>
   
  );
}
