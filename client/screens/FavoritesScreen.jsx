import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../constants/theme';

export default function FavoritesScreen({ navigation }) {
    const { user, refreshUser, loading } = useAuth();
    const favorites = user?.favoriteRecipes || [];

    useEffect(() => {
        refreshUser();
    }, []);

    const renderFavoriteCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item._id })}
            activeOpacity={0.9}
        >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.gradientOverlay} />

            <TouchableOpacity
                style={styles.favoriteBadge}
                onPress={async () => {
                    try {
                        await apiService.removeFromFavorites(item._id);
                        await refreshUser();
                    } catch (error) {
                        Alert.alert('Kitchen Oops', 'Cold not remove your treasure.');
                    }
                }}
            >
                <Ionicons name="heart" size={24} color={THEME.colors.primary} />
            </TouchableOpacity>

            <View style={styles.cardContent}>
                <View style={styles.cardTag}>
                    <Text style={styles.cardTagText}>{item.cuisine || 'Fine Dining'}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.cardFooter}>
                    <View style={styles.cardInfo}>
                        <Ionicons name="star" size={14} color="#fff" />
                        <Text style={styles.cardInfoText}>{item.rating}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={THEME.colors.primary} />
            </View>
        );
    }

    if (favorites.length === 0) {
        return (
            <View style={styles.center}>
                <View style={styles.emptyIconContainer}>
                    <Ionicons name="heart-dislike-outline" size={60} color={THEME.colors.text.light} />
                </View>
                <Text style={styles.emptyText}>Empty Kitchen Pantry</Text>
                <Text style={styles.emptySubtext}>Your curated flavors will appear here.</Text>
                <TouchableOpacity
                    style={styles.exploreButton}
                    onPress={() => navigation.navigate('Recipes')}
                >
                    <Text style={styles.exploreButtonText}>Discover New Flavors</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Favorites</Text>
                <Text style={styles.headerSubtitle}>{favorites.length} recipes saved to your pantry</Text>
            </View>
            <FlatList
                data={favorites}
                renderItem={renderFavoriteCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: THEME.spacing.xl,
    },
    header: {
        padding: THEME.spacing.lg,
        paddingTop: THEME.spacing.xl,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: THEME.colors.text.main,
        letterSpacing: -1,
    },
    headerSubtitle: {
        fontSize: 14,
        color: THEME.colors.text.muted,
        fontWeight: '500',
    },
    listContent: {
        padding: THEME.spacing.md,
    },
    card: {
        backgroundColor: THEME.colors.surface,
        borderRadius: THEME.radius.lg,
        marginBottom: THEME.spacing.lg,
        overflow: 'hidden',
        ...THEME.shadows.medium,
        height: 240,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    favoriteBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: THEME.radius.full,
        ...THEME.shadows.soft,
    },
    cardContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: THEME.spacing.md,
    },
    cardTag: {
        backgroundColor: THEME.colors.secondary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    cardTagText: {
        fontSize: 10,
        fontWeight: '800',
        color: THEME.colors.accent,
        textTransform: 'uppercase',
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    cardInfoText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 4,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: THEME.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: THEME.spacing.lg,
        ...THEME.shadows.soft,
    },
    emptyText: {
        fontSize: 22,
        fontWeight: '900',
        color: THEME.colors.text.main,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 16,
        color: THEME.colors.text.muted,
        textAlign: 'center',
        marginBottom: THEME.spacing.xl,
    },
    exploreButton: {
        backgroundColor: THEME.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: THEME.radius.full,
        ...THEME.shadows.medium,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
});
