import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RecipeDetailScreen({ route }) {
    const { recipeId } = route.params;
    const { user, refreshUser } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        loadRecipe();
    }, [recipeId]);

    useEffect(() => {
        if (user && user.favoriteRecipes) {
            const favorite = user.favoriteRecipes.some(fav =>
                (fav._id || fav) === recipeId
            );
            setIsFavorite(favorite);
        }
    }, [user, recipeId]);

    const loadRecipe = async () => {
        try {
            const response = await apiService.getRecipe(recipeId);
            setRecipe(response.data || response);
        } catch (error) {
            Alert.alert('Error', 'Failed to load recipe');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await apiService.removeFromFavorites(recipeId);
                setIsFavorite(false);
            } else {
                await apiService.addToFavorites(recipeId);
                setIsFavorite(true);
            }
            await refreshUser();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={styles.center}>
                <Text>Recipe not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: recipe.image || recipe.imageUrl }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.title}>{recipe.name || recipe.title}</Text>
                        <Text style={styles.cuisine}>{recipe.cuisine || ''} • {recipe.difficulty || ''}</Text>
                    </View>
                    <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={30}
                            color={isFavorite ? '#FF3B30' : '#666'}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.stats}>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Prep</Text>
                        <Text style={styles.statValue}>{recipe.prepTimeMinutes || recipe.cookingTime}m</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Cook</Text>
                        <Text style={styles.statValue}>{recipe.cookTimeMinutes || ''}m</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Servings</Text>
                        <Text style={styles.statValue}>{recipe.servings || ''}</Text>
                    </View>
                </View>

                {recipe.ingredients && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        {recipe.ingredients.map((ingredient, index) => (
                            <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
                        ))}
                    </View>
                )}

                {recipe.instructions && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        {recipe.instructions.map((instruction, index) => (
                            <View key={index} style={styles.instructionItem}>
                                <Text style={styles.instructionNumber}>{index + 1}</Text>
                                <Text style={styles.instructionText}>{instruction}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    headerLeft: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cuisine: {
        fontSize: 16,
        color: '#666',
    },
    favoriteButton: {
        padding: 5,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    stat: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    ingredient: {
        fontSize: 16,
        marginBottom: 8,
        lineHeight: 24,
    },
    instructionItem: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    instructionNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        color: '#007AFF',
    },
    instructionText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
    },
});
