import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  const handleRegister = async () => {
    const { firstName, lastName, username, email, password } = form;

    if (!firstName || !lastName || !username || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await register(form);

      if (res.success) {
        Alert.alert("Success", "Account created", [
          { text: "Login", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Error", res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Intro */}
        <View style={styles.intro}>
          <Text style={styles.title}>Join RecipeBook</Text>
          <Text style={styles.subtitle}>
            Create an account to start cooking smarter
          </Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Row>
            <Input
              label="First name"
              value={form.firstName}
              onChange={(v) => update("firstName", v)}
            />
            <Input
              label="Last name"
              value={form.lastName}
              onChange={(v) => update("lastName", v)}
            />
          </Row>

          <Input
            label="Username"
            value={form.username}
            onChange={(v) => update("username", v)}
            autoCapitalize="none"
          />

          <Input
            label="Email"
            value={form.email}
            onChange={(v) => update("email", v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordBox}>
              <TextInput
                style={styles.passwordInput}
                value={form.password}
                onChangeText={(v) => update("password", v)}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/* ---------- helpers ---------- */

const Row = ({ children }) => (
  <View style={{ flexDirection: "row", gap: 12 }}>{children}</View>
);

const Input = ({
  label,
  value,
  onChange,
  keyboardType,
  autoCapitalize,
}) => (
  <View style={{ flex: 1, marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
    />
  </View>
);

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A" },

  intro: { paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A" },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 6 },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  label: { fontSize: 12, color: "#64748B", marginBottom: 4 },

  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14,
  },

  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  passwordInput: { flex: 1, paddingVertical: 12 },

  primaryBtn: {
    backgroundColor: "#2563EB",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    gap: 6,
  },
  footerText: { color: "#64748B" },
  link: { color: "#2563EB", fontWeight: "700" },
});

export default RegisterScreen;
