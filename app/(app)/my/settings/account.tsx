import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  LogOut,
} from 'lucide-react-native';
import { useThemeColors } from '@/stores/themeStore';

export default function AccountSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useThemeColors();

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: () => router.replace('/') },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('계정 삭제', '삭제된 데이터는 복구할 수 없습니다. 계속하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive' },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgDeep }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>계정 관리</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.bgSurface }]}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </View>
            <View>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>moment_user</Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>user@example.com</Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <View style={styles.socialInfo}>
            <View style={styles.googleIcon}>
              <Text style={{ fontSize: 12 }}>G</Text>
            </View>
            <Text style={[styles.socialText, { color: colors.textSecondary }]}>Google 계정으로 연결됨</Text>
          </View>
          <Text style={[styles.joinDate, { color: colors.textSecondary }]}>2026년 1월 가입</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={[styles.menuLabel, { color: colors.textSecondary }]}>계정</Text>
          
          <Pressable style={[styles.menuItem, { backgroundColor: colors.bgSurface }]} onPress={handleLogout}>
            <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>로그아웃</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={[styles.menuItem, { backgroundColor: colors.bgSurface }]} onPress={handleDeleteAccount}>
            <View style={styles.menuItemRow}>
              <Trash2 size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>계정 삭제</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 100,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F4F3EF',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8491E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F4F3EF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.4)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  socialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  socialText: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.6)',
    fontWeight: '500',
  },
  joinDate: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.2)',
  },
  menuContainer: {
    gap: 8,
  },
  menuLabel: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.3)',
    fontWeight: '500',
    marginLeft: 4,
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F3EF',
  },
});
