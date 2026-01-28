import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../constants/api";
import { useAuth } from "../hooks/useAuth";

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    fetchRecipes();
  }, [search, difficulty]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (difficulty !== "All") params.difficulty = difficulty;

      const res = await api.get("/recipes", { params });
      setRecipes(res.data.data?.recipes || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("RecipeDetail", { id: item._id })}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/300" }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardMeta}>
          {item.cuisine} • {item.difficulty} •{" "}
          {item.prepTimeMinutes + item.cookTimeMinutes} min
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || "Chef"}</Text>
          <Text style={styles.subtitle}>What will you cook today?</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#64748B" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search recipes"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilter(true)}
        >
          <Ionicons name="options-outline" size={18} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#2563EB" />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={renderRecipe}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filter Modal */}
      <Modal transparent visible={showFilter} animationType="slide">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowFilter(false)}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Difficulty</Text>

            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.filterChip,
                  difficulty === d && styles.activeChip,
                ]}
                onPress={() => setDifficulty(d)}
              >
                <Text
                  style={[
                    styles.filterText,
                    difficulty === d && styles.activeChipText,
                  ]}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={22} color="#2563EB" />
          <Text style={styles.navActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate("AddRecipe")}
        >
          <Ionicons name="add-circle-outline" size={24} color="#64748B" />
          <Text style={styles.navText}>Add Recipe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Ionicons name="heart-outline" size={22} color="#64748B" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-outline" size={22} color="#64748B" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 20 },

  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: { fontSize: 22, fontWeight: "700", color: "#0F172A" },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 4 },

  searchRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: { flex: 1, marginLeft: 8, color: "#0F172A" },

  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 160 },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  cardMeta: { fontSize: 12, color: "#64748B", marginTop: 4 },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 11, color: "#64748B", marginTop: 4 },
  navActive: { fontSize: 11, color: "#2563EB", marginTop: 4 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  filterChip: {
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    marginBottom: 10,
    alignItems: "center",
  },
  activeChip: { backgroundColor: "#2563EB" },
  filterText: { color: "#334155", fontWeight: "600" },
  activeChipText: { color: "#FFFFFF" },
});

export default HomeScreen;
