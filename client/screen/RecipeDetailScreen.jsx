import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from "react-native";
import { Platform } from "react-native";
import api from "../constants/api";
import { useAuth } from "../hooks/useAuth"; // ✅ FIX

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const scale = (size) => (SCREEN_WIDTH / 375) * size;
const spacing = {
  xs: scale(5),
  sm: scale(10),
  md: scale(15),
  lg: scale(20),
  xl: scale(25),
  xxl: scale(30),
};

const RecipeDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;

  const { user } = useAuth(); // ✅ FIX (THIS WAS MISSING)

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchRecipe();
    checkIfFavorite();
  }, []);

  const fetchRecipe = async () => {
    try {
      const res = await api.get(`/recipes/${id}`);
      setRecipe(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const res = await api.get("/users/favorites");
      const favs = res.data.data?.recipes || res.data.data || [];
      setIsFavorite(favs.some((f) => f._id === id));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/users/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/users/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      await api.delete(`/recipes/${id}`);
      Alert.alert("Deleted", "Recipe deleted successfully");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "Delete failed");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.loading}>
        <Text>Recipe not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.mainImage} />

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={22} color="#333" />
            </TouchableOpacity>

            <View style={{ flexDirection: "row" }}>
              {user && recipe?.userId?._id === user?._id && (
                <TouchableOpacity
                  style={[styles.iconButton, { marginRight: 10 }]}
                  onPress={handleDeleteRecipe}
                >
                  <Ionicons name="trash-outline" size={22} color="#EF4444" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleFavorite}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={22}
                  color={isFavorite ? "#EF4444" : "#333"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.meta}>
            {recipe.cuisine} • {recipe.difficulty} •{" "}
            {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
          </Text>

          <Text style={styles.section}>Ingredients</Text>
          {recipe.ingredients.map((i, idx) => (
            <Text key={idx} style={styles.text}>• {i}</Text>
          ))}

          <Text style={styles.section}>Instructions</Text>
          {recipe.instructions.map((step, idx) => (
            <Text key={idx} style={styles.text}>
              {idx + 1}. {step}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  imageContainer: { height: SCREEN_HEIGHT * 0.4 },
  mainImage: { width: "100%", height: "100%" },

  headerButtons: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginTop: -30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  title: { fontSize: 22, fontWeight: "700", color: "#0F172A" },
  meta: { color: "#64748B", marginVertical: 8 },

  section: {
    marginTop: 20,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  text: { fontSize: 14, color: "#334155", marginBottom: 4 },
});

export default RecipeDetailScreen;
