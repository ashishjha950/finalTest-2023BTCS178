import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RecipesScreen({ navigation }) {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const data = await apiService.getRecipes();
            // Checking if response is an object with data property or just an array
            const recipeList = data.data || data;
            setRecipes(recipeList);
            setFilteredRecipes(recipeList);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch recipes');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = recipes.filter((recipe) =>
            (recipe.title || recipe.name || '').toLowerCase().includes(query.toLowerCase()) ||
            (recipe.description || '').toLowerCase().includes(query.toLowerCase())
        );
        setFilteredRecipes(filtered);
    };

    const toggleFavorite = async (recipeId) => {
        const isFav = user?.favoriteRecipes?.some(fav => (fav._id || fav) === recipeId);
        try {
            if (isFav) {
                await apiService.removeFromFavorites(recipeId);
            } else {
                await apiService.addToFavorites(recipeId);
            }
            await refreshUser();
        } catch (error) {
            Alert.alert('Error', 'Could not update favorites');
        }
    };

    const renderRecipeCard = ({ item }) => {
        const isFavorite = user?.favoriteRecipes?.some((fav) => (fav._id || fav) === item._id);

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: item._id })}
            >
                <Image source={{ uri: item.imageUrl || item.image }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title || item.name}</Text>
                    <Text style={styles.cardDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                    <View style={styles.cardFooter}>
                        <Text style={styles.cardInfo}>{item.cookingTime || (item.prepTimeMinutes + item.cookTimeMinutes)} mins</Text>
                        <Text style={styles.cardInfo}>{item.difficulty || item.cuisine}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.favoriteBadge}
                    onPress={() => toggleFavorite(item._id)}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={20}
                        color={isFavorite ? "#FF3B30" : "#666"}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>
            <FlatList
                data={filteredRecipes}
                renderItem={renderRecipeCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        padding: 15,
        backgroundColor: '#fff',
    },
    searchInput: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    listContent: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardImage: {
        width: '100%',
        height: 200,
    },
    cardContent: {
        padding: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardInfo: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
    },
    favoriteBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        padding: 5,
    },
});
