# Backend Integration Summary
**Date:** December 4, 2025  
**Project:** Keplix User-Side Frontend  
**Status:** ✅ Complete

---

## Overview
All recently updated UI components have been integrated with the Django backend APIs. This document outlines the backend connections, API endpoints used, and data flow for each component.

---

## 1. BookingDetails.jsx ✅

### **Backend Integration:**
- **Payment API:** Fetches payment details for the booking
- **Notification API:** Saves notification preferences locally
- **Phone Call:** Opens device dialer with vendor phone number

### **API Endpoints Used:**
```javascript
paymentsAPI.getPaymentByBooking(booking.id)
```

### **Data Flow:**
1. Component receives `booking` object from route params
2. On mount, fetches payment details using `booking.id`
3. Displays payment information (method, transaction_id, amount, status)
4. Falls back to service price if payment not found
5. Notification toggle saves preference to AsyncStorage
6. Phone button opens dialer with vendor phone number

### **Backend Data Required:**
```javascript
booking: {
  id: number,
  service: {
    name: string,
    vendor_name: string,
    vendor_phone: string,
    location: string,
    area: string,
    pincode: string,
    price: number
  },
  booking_date: string (YYYY-MM-DD),
  booking_time: string (HH:MM:SS),
  status: string,
  notes: string
}

payment: {
  method: string,
  transaction_id: string,
  amount: number,
  status: string (paid/pending/failed)
}
```

---

## 2. RescheduleBooking.jsx ✅

### **Backend Integration:**
- **Bookings API:** Updates booking date and time
- **AsyncStorage:** Retrieves user authentication data

### **API Endpoints Used:**
```javascript
bookingsAPI.updateBooking(userId, bookingId, updateData)
```

### **Data Flow:**
1. User selects new date and time from calendar
2. Confirmation modal displays selected date/time
3. On confirm:
   - Fetches user ID from AsyncStorage
   - Formats date (YYYY-MM-DD) and time (HH:MM:SS)
   - Sends PUT request to update booking
   - Sets status to 'pending' for vendor reconfirmation
4. Navigates to success screen on completion

### **API Request:**
```javascript
PUT /service_api/user/{userId}/bookings/update/{bookingId}
Body: {
  booking_date: "2024-06-26",
  booking_time: "16:30:00",
  status: "pending"
}
```

### **Error Handling:**
- No refresh token: Prompts re-login
- Network error: Shows error alert with retry option
- Invalid data: Displays backend error message

---

## 3. CancelBooking.jsx ✅

### **Backend Integration:**
- **Bookings API:** Updates booking status to 'cancelled'
- **AsyncStorage:** Retrieves user authentication data

### **API Endpoints Used:**
```javascript
bookingsAPI.updateBooking(userId, bookingId, { status: 'cancelled' })
```

### **Data Flow:**
1. Component mounts and immediately attempts cancellation
2. Fetches user ID from AsyncStorage
3. Sends PUT request to update booking status
4. Shows animated success screen on completion
5. Auto-redirects to BookingList after 2 seconds

### **API Request:**
```javascript
PUT /service_api/user/{userId}/bookings/update/{bookingId}
Body: {
  status: "cancelled"
}
```

### **Success States:**
- ✅ Loading: Shows spinner with "Cancelling your booking..."
- ✅ Success: Green checkmark with success message
- ❌ Error: Red icon with retry and go back buttons

---

## 4. ServiceProgress.jsx ✅

### **Backend Integration:**
- **Payment API:** Fetches billing breakdown
- **Bookings API:** Marks service as completed
- **AsyncStorage:** Retrieves user authentication data

### **API Endpoints Used:**
```javascript
paymentsAPI.getPaymentByBooking(booking.id)
bookingsAPI.updateBooking(userId, bookingId, { status: 'completed' })
```

### **Data Flow:**
1. On mount, fetches billing details from payment API
2. Displays:
   - Engine Cost
   - Service Cost
   - Additional Cost
   - Total Cost
3. On "Slide to complete":
   - Shows confirmation alert
   - Updates booking status to 'completed'
   - Shows success modal
   - Auto-navigates to Feedback screen

### **Backend Data Structure:**
```javascript
payment: {
  engine_cost: number,
  service_cost: number,
  additional_cost: number,
  amount: number (total)
}
```

### **Fallback Logic:**
If payment not found, calculates from service price:
- Engine Cost: 50% of service price
- Service Cost: 30% of service price
- Additional Cost: 20% of service price

---

## 5. Feedback.jsx ✅

### **Backend Integration:**
- **Reviews API:** Creates service review for bookings
- **Feedback API:** Creates general feedback without booking
- **AsyncStorage:** Retrieves user authentication data

### **API Endpoints Used:**
```javascript
reviewsAPI.createReview(reviewData)  // If booking exists
feedbackAPI.createFeedback(feedbackData)  // If no booking
```

### **Data Flow:**
1. Component receives optional `booking` object
2. User rates service (1-5 stars) and provides comments
3. On submit:
   - If booking exists: Creates review linked to booking
   - If no booking: Creates general feedback
4. Shows success alert and redirects to Homepage

### **API Request (with booking):**
```javascript
POST /interactions/reviews/create/
Body: {
  user_id: number,
  vendor_id: number,
  booking_id: number,
  rating: number (1-5),
  comment: string
}
```

### **API Request (without booking):**
```javascript
POST /interactions/feedback/
Body: {
  user_id: number,
  rating: number,
  feedback: string,
  improvement_tags: string[]
}
```

### **UI Features:**
- Displays booking service info if available
- 5-star rating system (red stars)
- Text input for detailed feedback
- "Skip" button to bypass feedback

---

## 6. Filters.jsx ✅

### **Backend Integration:**
- **Search API:** Passes filter parameters to services search
- **Navigation:** Returns filters to SearchResult component

### **Filter Parameters:**
```javascript
filters: {
  date: string (DD-MM-YYYY),
  service: string,
  paymentType: string,
  location: string,
  priceMin: number,
  priceMax: number
}
```

### **Data Flow:**
1. User selects filter options:
   - Date
   - Service Name (Engine Maintenance, Repair, etc.)
   - Payment Type
   - Location
   - Price Range
2. On "Apply Filters":
   - Creates filter object
   - Calls callback function if provided
   - Navigates to SearchResult with filters

### **Integration with SearchResult:**
```javascript
navigation.navigate('SearchResult', { filters })
```

---

## 7. SearchResult.jsx ✅

### **Backend Integration:**
- **Services API:** Searches services with query and filters
- **Navigation:** Receives filters from Filters component

### **API Endpoints Used:**
```javascript
servicesAPI.searchServices(query, filters)
```

### **Data Flow:**
1. Receives search query and optional filters
2. Sends API request with combined parameters
3. Displays service cards with results
4. Filter button opens Filters component
5. Re-searches when filters applied

### **API Request:**
```javascript
GET /service_api/user/services?search=Engine&category=Repair&location=Delhi&price_min=5&price_max=100
```

### **Search Parameters:**
- `search`: Search query string
- `category`: Service category/name
- `location`: Geographic location
- `price_min`: Minimum price filter
- `price_max`: Maximum price filter

### **Fallback:**
If API fails, shows default service cards

---

## 8. CustomerSupport.jsx ✅

### **Backend Integration:**
- **Linking API:** Opens phone, email, and message apps
- **Navigation:** Routes to ChatSupport and Feedback

### **Features:**
1. **Call Us:** Opens device dialer
2. **Message Us:** Navigates to ChatSupport
3. **Email Us:** Opens email client
4. **Raise Complaint:** Shows alert and navigates to Feedback

### **External Integrations:**
```javascript
Linking.openURL('tel:+911800123456')
Linking.openURL('mailto:support@keplix.com')
```

---

## API Configuration

### **Base URL:**
```javascript
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'
```

### **Authentication:**
All API requests include JWT Bearer token in headers:
```javascript
Authorization: `Bearer ${accessToken}`
```

### **Token Refresh:**
Automatic token refresh on 401 responses using refresh token

### **Error Handling:**
- Network errors: Show user-friendly alert
- 401 Unauthorized: Attempt token refresh, logout if failed
- 400/500 errors: Display backend error message

---

## AsyncStorage Usage

### **Data Stored:**
1. **User Data:** `user_data`
   ```javascript
   {
     user_id: number,
     email: string,
     phone_number: string,
     // ... other user fields
   }
   ```

2. **Notification Preferences:** `notification_{bookingId}`
   ```javascript
   true/false
   ```

3. **Authentication Tokens:** (managed by tokenManager)
   - `access_token`
   - `refresh_token`

---

## Testing Checklist

### **Backend Connection:**
- [x] API base URL configured
- [x] JWT authentication working
- [x] Token refresh mechanism functional
- [x] AsyncStorage data persistence

### **Bookings:**
- [x] View booking details
- [x] Reschedule booking
- [x] Cancel booking
- [x] Mark service complete
- [x] Payment details display

### **Feedback:**
- [x] Submit review with booking
- [x] Submit general feedback
- [x] Rating system functional
- [x] Navigation after submission

### **Search & Filters:**
- [x] Search services by query
- [x] Apply multiple filters
- [x] Filter parameter passing
- [x] Results display correctly

### **Support:**
- [x] Phone call integration
- [x] Email integration
- [x] Chat navigation
- [x] Feedback navigation

---

## Environment Variables

### **Required in `.env` file:**
```bash
EXPO_PUBLIC_API_URL=http://localhost:8000
```

For production:
```bash
EXPO_PUBLIC_API_URL=https://api.keplix.com
```

---

## Dependencies Required

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "@react-native-async-storage/async-storage": "^2.0.0",
    "@react-native-community/slider": "^4.5.0",
    "expo": "~52.0.0",
    "expo-secure-store": "~15.0.0",
    "react-native": "0.76.3"
  }
}
```

---

## Known Issues & Limitations

### **1. Notification Scheduling:**
- Currently only saves preference to AsyncStorage
- Actual push notifications require expo-notifications setup
- Recommendation: Implement expo-notifications for reminder alerts

### **2. Real-time Updates:**
- No WebSocket implementation for live booking status
- Consider implementing Socket.IO or WebSockets for real-time vendor updates

### **3. Image Upload:**
- Service images use placeholders
- Need to implement image upload for service photos

### **4. Payment Gateway:**
- Payment details fetched from backend
- Actual payment processing requires payment gateway integration (Razorpay, Stripe, etc.)

---

## Next Steps

### **Immediate:**
1. ✅ Test all API endpoints with backend server
2. ✅ Verify data formats match backend responses
3. ✅ Handle edge cases (null data, network errors)
4. ✅ Add loading states for all async operations

### **Future Enhancements:**
1. Implement expo-notifications for reminders
2. Add real-time status updates via WebSockets
3. Integrate payment gateway for in-app payments
4. Add image upload capability for user profiles
5. Implement caching strategy for offline support

---

## Success Criteria

✅ All components successfully communicate with backend  
✅ Error handling implemented for all API calls  
✅ User authentication persists across app restarts  
✅ Data formats validated and type-safe  
✅ Loading states provide clear user feedback  
✅ Fallback UI shown when data unavailable  
✅ Navigation flows work correctly  
✅ AsyncStorage data persists properly  

---

## Contact

For backend API questions, refer to:
- **Backend Documentation:** `/Backend/README.md`
- **API Verification Report:** `/API_VERIFICATION_REPORT.md`
- **Setup Guide:** `/Backend/SETUP_GUIDE.md`

---

**Status:** ✅ **All components fully integrated with backend APIs**

