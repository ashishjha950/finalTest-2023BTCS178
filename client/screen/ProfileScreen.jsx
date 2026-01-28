import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../constants/api";
import { useAuth } from "../hooks/useAuth";

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const [showPassModal, setShowPassModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      const d = res.data.data;
      setFirstName(d.firstName || "");
      setLastName(d.lastName || "");
      setUsername(d.username || "");
      setEmail(d.email || "");
      setBio(d.bio || "");
    } catch {
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!firstName || !lastName) {
      Alert.alert("Error", "Name fields are required");
      return;
    }
    try {
      setSaving(true);
      const res = await api.put("/users/profile", {
        firstName,
        lastName,
        username,
        bio,
      });
      updateUser(res.data.data);
      Alert.alert("Saved", "Profile updated");
    } catch {
      Alert.alert("Error", "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      await api.put("/users/password", { currentPassword, newPassword });
      Alert.alert("Success", "Password updated");
      setShowPassModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      Alert.alert("Error", "Password update failed");
    }
  };

  const deleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await api.delete("/users/profile");
            logout();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarBlock}>
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=2563EB&color=fff`,
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.username}>@{username}</Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Field label="First name" value={firstName} onChange={setFirstName} />
          <Field label="Last name" value={lastName} onChange={setLastName} />
          <Field label="Username" value={username} onChange={setUsername} />
          <Field label="Email" value={email} disabled />
          <Field
            label="Bio"
            value={bio}
            onChange={setBio}
            multiline
            height={80}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={saveProfile}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.list}>
          <Action
            icon="lock-closed"
            label="Change Password"
            onPress={() => setShowPassModal(true)}
          />
          <Action
            icon="heart"
            label="Favorites"
            onPress={() => navigation.navigate("Favorites")}
          />
          <Action
            icon="calendar"
            label="Meal Plans"
            onPress={() => navigation.navigate("MealPlan")}
          />
          <Action icon="log-out" label="Logout" onPress={logout} />
          <Action
            icon="trash"
            label="Delete Account"
            danger
            onPress={deleteAccount}
          />
        </View>
      </ScrollView>

      {/* Password Modal */}
      <Modal transparent visible={showPassModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <Input
              placeholder="Current password"
              secure
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <Input
              placeholder="New password"
              secure
              value={newPassword}
              onChange={setNewPassword}
            />
            <Input
              placeholder="Confirm password"
              secure
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <View style={styles.modalRow}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setShowPassModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={changePassword}
              >
                <Text style={styles.primaryText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


const Field = ({ label, value, onChange, disabled, multiline, height }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        disabled && { backgroundColor: "#F1F5F9" },
        height && { height },
      ]}
      value={value}
      editable={!disabled}
      onChangeText={onChange}
      multiline={multiline}
    />
  </View>
);

const Action = ({ icon, label, onPress, danger }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <Ionicons
      name={icon}
      size={20}
      color={danger ? "#EF4444" : "#2563EB"}
    />
    <Text style={[styles.rowText, danger && { color: "#EF4444" }]}>
      {label}
    </Text>
    <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
  </TouchableOpacity>
);

const Input = ({ placeholder, secure, value, onChange }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    secureTextEntry={secure}
    value={value}
    onChangeText={onChange}
  />
);

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A" },

  avatarBlock: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  name: { fontSize: 20, fontWeight: "700", marginTop: 10 },
  username: { color: "#64748B" },

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
  },

  primaryBtn: {
    backgroundColor: "#2563EB",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  primaryText: { color: "#fff", fontWeight: "700" },

  list: { marginTop: 30, marginHorizontal: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 14,
  },
  rowText: { flex: 1, fontSize: 15, color: "#0F172A" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  modalRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  secondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileScreen;
