import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  PenLine,
  ChevronRight,
  Bell,
  Palette,
  RotateCcw,
  User,
  Smartphone,
  Globe,
  Crown,
  Bookmark,
  EyeOff,
} from 'lucide-react-native';

const MENU_CONTENT = [
  { id: 'library', title: '보관함', count: '28개', icon: Bookmark, route: '/(app)/library' },
  { id: 'hidden', title: '히든함', count: '5개', icon: EyeOff, route: '/(app)/my/hidden' },
];

const MENU_SETTINGS = [
  { id: 'notif', title: '알림 설정', icon: Bell },
  { id: 'theme', title: '테마 설정', icon: Palette },
  { id: 'reset', title: '명언 선호 재설정', icon: RotateCcw },
  { id: 'account', title: '계정 관리', icon: User },
  { id: 'widget', title: '위젯 가이드', icon: Smartphone },
  { id: 'lang', title: '언어', value: '한국어', icon: Globe },
];

export default function MyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>M</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>moment_user</Text>
            <Text style={styles.userEmail}>user@example.com</Text>
          </View>
          <Pressable style={styles.editProfileBtn}>
            <PenLine size={20} color="rgba(244,243,239,0.5)" />
          </Pressable>
        </View>

        {/* Pro Banner */}
        <Pressable style={styles.proBanner}>
          <View style={styles.proLeft}>
            <View style={styles.crownCircle}>
              <Crown size={16} color="#FFD700" fill="#FFD700" />
            </View>
            <View>
              <Text style={styles.proTitle}>Moment Pro로 업그레이드</Text>
              <Text style={styles.proDesc}>광고 제거 · 보관함 확장 · 내보내기</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#FFFFFF" />
        </Pressable>

        {/* Content Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 콘텐츠</Text>
          <View style={styles.menuGroup}>
            {MENU_CONTENT.map((item) => (
              <Pressable 
                key={item.id} 
                style={styles.menuItem}
                onPress={() => item.route && router.push(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <item.icon size={20} color="#E8607A" strokeWidth={2} />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{item.count}</Text>
                  </View>
                  <ChevronRight size={18} color="rgba(244,243,239,0.25)" />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>설정</Text>
          <View style={styles.menuGroup}>
            {MENU_SETTINGS.map((item, idx) => (
              <React.Fragment key={item.id}>
                <Pressable style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <item.icon size={20} color="rgba(244,243,239,0.6)" strokeWidth={1.5} />
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.value && (
                      <Text style={styles.menuValueText}>{item.value}</Text>
                    )}
                    <ChevronRight size={18} color="rgba(244,243,239,0.25)" />
                  </View>
                </Pressable>
                {idx < MENU_SETTINGS.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutBtn}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8491E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4F3EF',
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.4)',
    marginTop: 2,
  },
  editProfileBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#301008', // Dark deep orange
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 73, 30, 0.3)',
    marginBottom: 32,
  },
  proLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crownCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  proDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(244,243,239,0.4)',
    marginBottom: 12,
    paddingLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuGroup: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#F4F3EF',
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
  },
  countText: {
    fontSize: 11,
    color: 'rgba(244,243,239,0.5)',
    fontWeight: '600',
  },
  menuValueText: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.3)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
  },
  logoutBtn: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.4)',
    textDecorationLine: 'underline',
  },
});
