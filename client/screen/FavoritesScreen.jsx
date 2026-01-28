import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../constants/api";

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
    const unsubscribe = navigation.addListener("focus", loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/favorites");
      setFavorites(res.data.data?.recipes || res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    await api.delete(`/users/favorites/${id}`);
    setFavorites((prev) => prev.filter((r) => r._id !== id));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("RecipeDetail", { id: item._id })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cuisine}>{item.cuisine}</Text>
          <TouchableOpacity onPress={() => removeFavorite(item._id)}>
            <Ionicons name="heart" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color="#64748B" />
          <Text style={styles.metaText}>
            {item.prepTimeMinutes + item.cookTimeMinutes} min
          </Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>
            {item.caloriesPerServing || 0} kcal
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favourites</Text>
        <View style={{ width: 22 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.center}>
          <Ionicons
            name="heart-outline"
            size={80}
            color="#CBD5E1"
          />
          <Text style={styles.emptyTitle}>No favourites yet</Text>
          <Text style={styles.emptySub}>
            Save recipes you love to see them here
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.primaryText}>Explore Recipes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(i) => i._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 12,
  },
  emptySub: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  image: { width: 96, height: 96 },

  cardBody: { flex: 1, padding: 12 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cuisine: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginVertical: 6,
  },

  metaRow: { flexDirection: "row", alignItems: "center" },
  metaText: { fontSize: 12, color: "#64748B", marginLeft: 4 },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#94A3B8",
    marginHorizontal: 6,
  },

  primaryBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 20,
  },
  primaryText: { color: "#fff", fontWeight: "700" },
});

export default FavoritesScreen;
