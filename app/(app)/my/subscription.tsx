import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Crown,
  Check,
  ArrowRight,
  Plus,
} from 'lucide-react-native';
import { darkColors, lightColors } from '@/tokens/colors';
import { typography } from '@/tokens/typography';
import { spacing, borderRadius } from '@/tokens/spacing';

const { width: SCREEN_W } = Dimensions.get('window');

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(true);

  const colors = darkColors; // 다크 모드 고정 (디자인 가이드 기반)

  const features = [
    '광고 없는 깨끗한 경험',
    '보관함 최대 70개',
    '.txt / .md 내보내기',
    '다중 카테고리 선택',
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bgDeep }]}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top, paddingBottom: insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.crownWrapper}>
            <Crown size={40} color={colors.actionCta} fill={colors.actionCta} />
          </View>
          <Text style={styles.heroTitle}>
            Moment <Text style={styles.proItalic}>Pro</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            오늘의 명언이 내일의 습관이 됩니다
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {features.map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Plus size={16} color={colors.actionCta} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Toggle Container */}
        <View style={styles.toggleWrapper}>
          <View style={styles.toggleTrack}>
            <Pressable 
              style={[styles.toggleBtn, !isYearly && styles.toggleBtnActive]} 
              onPress={() => setIsYearly(false)}
            >
              <Text style={[styles.toggleBtnText, !isYearly && styles.toggleBtnTextActive]}>
                월간
              </Text>
            </Pressable>
            <Pressable 
              style={[styles.toggleBtn, isYearly && styles.toggleBtnActive]} 
              onPress={() => setIsYearly(true)}
            >
              <View style={styles.yearlyLabelWrapper}>
                <Text style={[styles.toggleBtnText, isYearly && styles.toggleBtnTextActive]}>
                  연간
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>15%</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Price Info */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceMain}>
            ₩?.???<Text style={styles.priceSub}>/월 (연간 결제)</Text>
          </Text>
          <Text style={styles.priceDetail}>
            연간 결제 시 월간 대비 15% 절약
          </Text>
        </View>

        {/* CTA Button */}
        <Pressable style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>시작하기</Text>
        </Pressable>

        <Pressable style={styles.restoreBtn}>
          <Text style={styles.restoreText}>Restore Purchase</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    height: 56,
    justifyContent: 'center',
  },
  backBtn: {
    marginLeft: -8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 48,
  },
  crownWrapper: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#F4F3EF',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  proItalic: {
    fontStyle: 'italic',
    fontWeight: '400',
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(244,243,239,0.6)',
    marginTop: 12,
    fontWeight: '500',
  },
  featuresContainer: {
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(232, 73, 30, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#F4F3EF',
    fontWeight: '500',
  },
  toggleWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  toggleTrack: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 4,
    width: '100%',
  },
  toggleBtn: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: 'rgba(232, 73, 30, 0.5)',
  },
  toggleBtnText: {
    fontSize: 15,
    color: 'rgba(244,243,239,0.3)',
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: '#F4F3EF',
  },
  yearlyLabelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#E8491E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  priceMain: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F4F3EF',
    marginBottom: 8,
  },
  priceSub: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.4)',
    fontWeight: '400',
  },
  priceDetail: {
    fontSize: 13,
    color: '#E8491E',
    fontWeight: '600',
  },
  ctaBtn: {
    backgroundColor: '#E8491E',
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E8491E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  restoreBtn: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 12,
  },
  restoreText: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.3)',
    fontWeight: '500',
  },
});
