# Recipe Book Frontend

A minimal React Native (Expo) app for browsing recipes, managing favorites, and viewing recipe details.

## Features

- **Authentication**: Login and registration
- **Recipe Browsing**: View all recipes with search functionality
- **Recipe Details**: View full recipe information including ingredients and instructions
- **Favorites**: Save and manage favorite recipes
- **Profile**: View user profile and logout

## Prerequisites

- Node.js (v14 or higher)
- Expo CLI
- Backend API running on `http://localhost:5001`

## Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

## Running the App

Start the Expo development server:
```bash
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app for physical device

## Default Test User

Use these credentials to login:
- **Email**: `emily.johnson@example.com`
- **Password**: `password123`

## Project Structure

```
client/
├── screens/           # App screens
│   ├── LoginScreen.jsx
│   ├── RecipesScreen.jsx
│   ├── RecipeDetailScreen.jsx
│   ├── FavoritesScreen.jsx
│   └── ProfileScreen.jsx
├── services/          # API services
│   └── api.js
├── context/           # React contexts
│   └── AuthContext.jsx
└── App.jsx           # Main app entry
```

## API Configuration

The app connects to the backend API at `http://localhost:5001/api`. 

To change the API URL, edit `client/services/api.js`:
```javascript
const API_URL = 'http://your-api-url/api';
```

## Key Dependencies

- `expo`: React Native framework
- `@react-navigation/native`: Navigation
- `@react-navigation/stack`: Stack navigation
- `@react-navigation/bottom-tabs`: Tab navigation
- `@react-native-async-storage/async-storage`: Local storage for tokens
