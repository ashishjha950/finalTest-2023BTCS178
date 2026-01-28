import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './screen/LoginScreen';
import RegisterScreen from './screen/RegisterScreen';
import HomeScreen from './screen/HomeScreen';
import RecipeDetailScreen from './screen/RecipeDetailScreen';
import FavoritesScreen from './screen/FavoritesScreen';
import ProfileScreen from './screen/ProfileScreen';
import AddRecipeScreen from './screen/AddRecipeScreen';
import MealPlanScreen from './screen/MealPlanScreen';
import MealPlanDetailScreen from './screen/MealPlanDetailScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#223973" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Favorites" component={FavoritesScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="AddRecipe" component={AddRecipeScreen} />
                        <Stack.Screen name="MealPlan" component={MealPlanScreen} />
                        <Stack.Screen name="MealPlanDetail" component={MealPlanDetailScreen} />
                        <Stack.Screen
                            name="RecipeDetail"
                            component={RecipeDetailScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <Navigation />
        </AuthProvider>
    );
}
