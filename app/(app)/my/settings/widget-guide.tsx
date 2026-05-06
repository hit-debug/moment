import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Smartphone, Plus } from 'lucide-react-native';
import { useThemeColors } from '@/stores/themeStore';

export default function WidgetGuideScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgDeep }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>위젯 설정 가이드</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Smartphone size={32} color={colors.actionCta} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>홈 화면에서 매일의{'\n'}영감을 확인하세요</Text>
          <Text style={[styles.heroDesc, { color: colors.textSecondary }]}>앱을 열지 않아도 명언을 바로 볼 수 있습니다.</Text>
        </View>

        <View style={styles.stepSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>설정 방법</Text>
          
          <View style={[styles.stepCard, { backgroundColor: colors.bgSurface }]}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
            <Text style={[styles.stepText, { color: colors.textPrimary }]}>홈 화면의 빈 공간을 길게 누릅니다.</Text>
          </View>

          <View style={[styles.stepCard, { backgroundColor: colors.bgSurface }]}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
            <Text style={[styles.stepText, { color: colors.textPrimary }]}>
              좌측 상단의 <Text style={styles.bold}>+</Text> 버튼(iOS) 또는 
              하단의 <Text style={styles.bold}>위젯</Text> 메뉴(Android)를 선택합니다.
            </Text>
          </View>

          <View style={[styles.stepCard, { backgroundColor: colors.bgSurface }]}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>3</Text></View>
            <Text style={[styles.stepText, { color: colors.textPrimary }]}>
              <Text style={styles.bold}>Moment</Text>를 검색하여 원하는 사이즈의 위젯을 추가합니다.
            </Text>
          </View>
        </View>

        <View style={[styles.tipBox, { backgroundColor: colors.bgSurface, borderColor: colors.divider }]}>
          <Text style={[styles.tipTitle, { color: colors.textPrimary }]}>💡 TIP</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            위젯은 매일 자정 자동으로 새로운 명언으로 업데이트됩니다. 만약 업데이트가 되지 않는다면 앱을 한 번 실행해주세요.
          </Text>
        </View>

        <Pressable style={styles.doneBtn} onPress={() => router.back()}>
          <Text style={styles.doneBtnText}>확인했습니다</Text>
        </Pressable>
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
    paddingHorizontal: 24,
  },
  hero: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(232, 73, 30, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F4F3EF',
    textAlign: 'center',
    lineHeight: 32,
  },
  heroDesc: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.4)',
    marginTop: 12,
    textAlign: 'center',
  },
  stepSection: {
    gap: 12,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(244,243,239,0.5)',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8491E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#F4F3EF',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
    color: '#E8491E',
  },
  tipBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F4F3EF',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.4)',
    lineHeight: 20,
  },
  doneBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F4F3EF',
  },
});
