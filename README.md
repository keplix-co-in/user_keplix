# Keplix User App (Frontend)

Keplix is a comprehensive car service booking application that connects vehicle owners with trusted workshops and service centers. This repository contains the user-facing mobile application built with React Native and Expo.

## 🚀 Features

*   **Service Discovery**: Browse and search for workshops, car washes, detailing, and repair services nearby.
*   **Booking System**: Schedule appointments for services at convenient dates and times.
*   **Real-time Updates**: Track booking status from confirmation to completion.
*   **Secure Payments**: Integrated payment methods for hassle-free transactions.
*   **User Profile**: Manage vehicles, addresses, and booking history.
*   **Reviews & Ratings**: Rate workshops and read reviews from other users.
*   **Authentication**: Secure sign-up/login via Email and Phone (OTP).

## 🛠️ Tech Stack

*   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
*   **Navigation**: React Navigation (Stack)
*   **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
*   **State Management**: React Hooks & Context
*   **API Client**: Axios
*   **Storage**: AsyncStorage & Expo Secure Store
*   **Maps**: React Native Maps
*   **UI Components**: Custom components + Expo Vector Icons

## 📂 Project Structure

```
user_keplix/
└── keplix-frontend-UserSide/
    ├── app/                # Main application layout and routes
    ├── components/         # Reusable UI components (Screens, Cards, etc.)
    │   ├── Bookings/       # Booking related screens
    │   ├── Homepage/       # Home screen and discovery
    │   ├── Profile/        # User profile management
    │   ├── Services/       # Service listing and details
    │   └── SignUps/        # Auth screens
    ├── services/           # API integration and services
    │   ├── api.js          # Main API client
    │   ├── locationService.js
    │   └── tokenManager.js
    └── assets/             # Images, fonts, and icons
```

## ⚡ Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   Expo Go app on your physical device (iOS/Android) OR Android Studio/Xcode for emulation.

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd user_keplix/keplix-frontend-UserSide
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root of `keplix-frontend-UserSide` and add your backend URL:
    ```env
    EXPO_PUBLIC_API_URL=http://<YOUR_IP_ADDRESS>:8000
    ```
    *Note: If testing on a physical device, use your computer's local IP address (e.g., `192.168.1.5`), not `localhost`.*

### Running the App

Start the Expo development server:

```bash
npx expo start
```

*   **Scan the QR code** with the Expo Go app (Android) or Camera app (iOS).
*   Press `a` to open in Android Emulator.
*   Press `i` to open in iOS Simulator.
*   Press `w` to run in a web browser.

## 📱 backend Connection

This frontend requires the **Keplix Backend** (Django) to be running. Ensure your backend server is active and the API URL is correctly configured in the `.env` file.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---
**Keplix** - *Ride Confident*
