import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../constants/api";

const AddRecipeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const rs = (v) => Math.round((width / 375) * v);
  const isSmall = width < 360;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    cuisine: "",
    image: "",
    difficulty: "Medium",
    prepTime: "",
    cookTime: "",
    servings: "",
    calories: "",
  });

  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instruction, setInstruction] = useState("");
  const [instructions, setInstructions] = useState([]);

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = async () => {
    const { name, cuisine, image, prepTime, cookTime, servings } = form;
    if (!name || !cuisine || !image || !prepTime || !cookTime || !servings || !ingredients.length || !instructions.length) {
      Alert.alert("Error", "Fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/recipes", {
        ...form,
        prepTimeMinutes: +form.prepTime,
        cookTimeMinutes: +form.cookTime,
        servings: +form.servings,
        caloriesPerServing: +form.calories || 0,
        ingredients,
        instructions,
      });
      Alert.alert("Success", "Recipe created", [{ text: "OK", onPress: () => navigation.navigate("Home") }]);
    } catch {
      Alert.alert("Error", "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#F8FAFC" }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={rs(22)} color="#0F172A" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: rs(18) }]}>Add Recipe</Text>
        <View style={{ width: rs(22) }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: rs(16) }}>
        <Card rs={rs}>
          <Field rs={rs} label="Recipe Name *">
            <Input rs={rs} value={form.name} onChange={(v) => update("name", v)} />
          </Field>

          <Row rs={rs}>
            <Field rs={rs} label="Cuisine *">
              <Input rs={rs} value={form.cuisine} onChange={(v) => update("cuisine", v)} />
            </Field>
            <Field rs={rs} label="Difficulty *">
              <View style={{ flexDirection: "row", gap: rs(6), flexWrap: "wrap" }}>
                {["Easy", "Medium", "Hard"].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.chip, { padding: rs(8) }, form.difficulty === d && styles.chipActive]}
                    onPress={() => update("difficulty", d)}
                  >
                    <Text style={[styles.chipText, form.difficulty === d && styles.chipTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>
          </Row>

          <Field rs={rs} label="Image URL *">
            <Input rs={rs} value={form.image} onChange={(v) => update("image", v)} />
          </Field>

          <Row rs={rs}>
            <Field rs={rs} label="Prep (min) *">
              <Input rs={rs} keyboard="numeric" value={form.prepTime} onChange={(v) => update("prepTime", v)} />
            </Field>
            <Field rs={rs} label="Cook (min) *">
              <Input rs={rs} keyboard="numeric" value={form.cookTime} onChange={(v) => update("cookTime", v)} />
            </Field>
          </Row>

          <Row rs={rs}>
            <Field rs={rs} label="Servings *">
              <Input rs={rs} keyboard="numeric" value={form.servings} onChange={(v) => update("servings", v)} />
            </Field>
            <Field rs={rs} label="Calories">
              <Input rs={rs} keyboard="numeric" value={form.calories} onChange={(v) => update("calories", v)} />
            </Field>
          </Row>
        </Card>

        <Card rs={rs}>
          <Field rs={rs} label="Ingredients *">
            <AddRow rs={rs} value={ingredient} onChange={setIngredient} onAdd={() => ingredient && setIngredients([...ingredients, ingredient.trim()]) && setIngredient("")} />
            <ChipList rs={rs} data={ingredients} onRemove={(i) => setIngredients(ingredients.filter((_, x) => x !== i))} />
          </Field>
        </Card>

        <Card rs={rs}>
          <Field rs={rs} label="Instructions *">
            <AddRow rs={rs} multiline value={instruction} onChange={setInstruction} onAdd={() => instruction && setInstructions([...instructions, instruction.trim()]) && setInstruction("")} />
            {instructions.map((s, i) => (
              <View key={i} style={[styles.step, { padding: rs(12) }]}>
                <Text style={{ fontWeight: "700", color: "#2563EB" }}>{i + 1}</Text>
                <Text style={{ flex: 1 }}>{s}</Text>
                <TouchableOpacity onPress={() => setInstructions(instructions.filter((_, x) => x !== i))}>
                  <Ionicons name="trash-outline" size={rs(18)} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </Field>
        </Card>

        <TouchableOpacity style={[styles.primaryBtn, { height: isSmall ? rs(46) : rs(52) }]} onPress={submit}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.primaryText, { fontSize: rs(15) }]}>Create Recipe</Text>}
        </TouchableOpacity>

        <View style={{ height: rs(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

/* ---------- helpers ---------- */

const Card = ({ children, rs }) => (
  <View style={{ backgroundColor: "#fff", borderRadius: rs(16), padding: rs(16), borderWidth: 1, borderColor: "#E5E7EB", marginBottom: rs(16) }}>
    {children}
  </View>
);

const Field = ({ label, children, rs }) => (
  <View style={{ marginBottom: rs(14) }}>
    <Text style={{ fontSize: rs(12), color: "#64748B", marginBottom: rs(6) }}>{label}</Text>
    {children}
  </View>
);

const Row = ({ children, rs }) => (
  <View style={{ flexDirection: "row", gap: rs(12), flexWrap: "wrap" }}>{children}</View>
);

const Input = ({ value, onChange, keyboard, rs }) => (
  <TextInput
    style={{ backgroundColor: "#F9FAFB", borderRadius: rs(10), padding: rs(12), borderWidth: 1, borderColor: "#E5E7EB", minWidth: "100%" }}
    value={value}
    onChangeText={onChange}
    keyboardType={keyboard}
  />
);

const AddRow = ({ value, onChange, onAdd, multiline, rs }) => (
  <View style={{ flexDirection: "row", gap: rs(8), alignItems: "center" }}>
    <TextInput
      style={{ flex: 1, backgroundColor: "#F9FAFB", borderRadius: rs(10), padding: rs(12), borderWidth: 1, borderColor: "#E5E7EB", height: multiline ? rs(80) : rs(48) }}
      value={value}
      onChangeText={onChange}
      multiline={multiline}
    />
    <TouchableOpacity style={{ width: rs(44), height: rs(44), backgroundColor: "#2563EB", borderRadius: rs(12), justifyContent: "center", alignItems: "center" }} onPress={onAdd}>
      <Ionicons name="add" size={rs(22)} color="#fff" />
    </TouchableOpacity>
  </View>
);

const ChipList = ({ data, onRemove, rs }) => (
  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: rs(8), marginTop: rs(10) }}>
    {data.map((t, i) => (
      <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: rs(6), backgroundColor: "#E5E7EB", paddingHorizontal: rs(10), paddingVertical: rs(6), borderRadius: rs(14) }}>
        <Text>{t}</Text>
        <TouchableOpacity onPress={() => onRemove(i)}>
          <Ionicons name="close" size={rs(14)} color="#64748B" />
        </TouchableOpacity>
      </View>
    ))}
  </View>
);


const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  headerTitle: { fontWeight: "700", color: "#0F172A" },
  chip: { borderRadius: 10, backgroundColor: "#E5E7EB" },
  chipActive: { backgroundColor: "#2563EB" },
  chipText: { fontSize: 12, color: "#334155" },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  step: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F1F5F9", borderRadius: 12, marginBottom: 8 },
  primaryBtn: { backgroundColor: "#2563EB", borderRadius: 14, justifyContent: "center", alignItems: "center", marginTop: 10 },
  primaryText: { color: "#fff", fontWeight: "700" },
});

export default AddRecipeScreen;
