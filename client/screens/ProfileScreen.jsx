import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Hanging up the Apron?',
      'Are you sure you want to sign out of the kitchen?',
      [
        { text: 'Keep Cooking', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Kitchen Error', 'Failed to log out. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </Text>
          </View>
          <View style={styles.editBadge}>
            <Ionicons name="camera" size={12} color="#fff" />
          </View>
        </View>
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role || 'Gourmet Chef'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pantry Details</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="mail" size={18} color="#2196F3" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Kitchen Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="calendar" size={18} color="#9C27B0" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Joined Kitchen</Text>
                <Text style={styles.infoValue}>Recent Member</Text>
              </View>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <View style={styles.infoLabelContainer}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="ribbon" size={18} color="#FF9800" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Chef Level</Text>
                <Text style={styles.infoValue}>Executive Gourmet</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Hang Up Apron</Text>
        <Ionicons name="log-out-outline" size={20} color={THEME.colors.status.error} />
      </TouchableOpacity>

      <Text style={styles.footerText}>Version 1.0.0 • Handcrafted for foodies</Text>
    </ScrollView>
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
  },
  header: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderBottomLeftRadius: THEME.radius.lg,
    borderBottomRightRadius: THEME.radius.lg,
    ...THEME.shadows.soft,
  },
  avatarContainer: {
    marginBottom: THEME.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...THEME.shadows.medium,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: THEME.colors.accent,
    padding: 6,
    borderRadius: THEME.radius.full,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    color: THEME.colors.text.main,
    letterSpacing: -0.5,
  },
  username: {
    fontSize: 16,
    color: THEME.colors.text.muted,
    marginBottom: THEME.spacing.sm,
  },
  roleBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.text.muted,
    textTransform: 'uppercase',
  },
  section: {
    padding: THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.text.main,
    marginBottom: THEME.spacing.md,
    letterSpacing: -0.5,
  },
  infoCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    ...THEME.shadows.soft,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.text.muted,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.text.main,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: THEME.spacing.lg,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    backgroundColor: '#FFF1F0',
    borderWidth: 1,
    borderColor: '#FFA39E',
    marginBottom: THEME.spacing.xl,
  },
  logoutText: {
    color: THEME.colors.status.error,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  footerText: {
    textAlign: 'center',
    color: THEME.colors.text.light,
    fontSize: 12,
    marginBottom: THEME.spacing.xl,
  },
});