import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../constants/api";

const MealPlanDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/meal-plans/${id}`);
      setMealPlan(res.data.data);
    } catch {
      Alert.alert("Error", "Failed to load meal plan");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (dayId, itemId) => {
    try {
      const updatedMeals = mealPlan.meals
        .map((day) =>
          day._id === dayId
            ? { ...day, items: day.items.filter((i) => i._id !== itemId) }
            : day
        )
        .filter((day) => day.items.length);

      await api.put(`/meal-plans/${id}`, { meals: updatedMeals });
      loadPlan();
    } catch {
      Alert.alert("Error", "Failed to remove item");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!mealPlan) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mealPlan.name}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {mealPlan.meals.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="calendar-clear-outline"
              size={80}
              color="#CBD5E1"
            />
            <Text style={styles.emptyTitle}>No meals added yet</Text>
            <Text style={styles.emptySub}>
              Start adding recipes to this plan
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.primaryText}>Browse Recipes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          mealPlan.meals
            .sort((a, b) => new Date(a.day) - new Date(b.day))
            .map((day) => (
              <View key={day._id} style={styles.dayBlock}>
                <View style={styles.dayHeader}>
                  <Ionicons name="calendar-outline" size={16} color="#2563EB" />
                  <Text style={styles.dayTitle}>
                    {new Date(day.day).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>

                {day.items.map((item) => (
                  <View key={item._id} style={styles.card}>
                    <TouchableOpacity
                      style={styles.cardLeft}
                      onPress={() =>
                        navigation.navigate("RecipeDetail", {
                          id: item.recipe._id,
                        })
                      }
                    >
                      <Image
                        source={{ uri: item.recipe.image }}
                        style={styles.image}
                      />
                      <View>
                        <Text style={styles.mealType}>
                          {item.mealType.toUpperCase()}
                        </Text>
                        <Text style={styles.recipeName} numberOfLines={1}>
                          {item.recipe.name}
                        </Text>
                        <Text style={styles.meta}>
                          {item.recipe.prepTimeMinutes +
                            item.recipe.cookTimeMinutes}{" "}
                          min • {item.servings} servings
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => removeItem(day._id, item._id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  },

  content: { padding: 20 },

  empty: {
    alignItems: "center",
    marginTop: 100,
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

  primaryBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 20,
  },
  primaryText: { color: "#fff", fontWeight: "700" },

  dayBlock: { marginBottom: 24 },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  dayTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  image: { width: 56, height: 56, borderRadius: 10 },

  mealType: {
    fontSize: 10,
    color: "#2563EB",
    fontWeight: "700",
  },
  recipeName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },
  meta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});

export default MealPlanDetailScreen;
