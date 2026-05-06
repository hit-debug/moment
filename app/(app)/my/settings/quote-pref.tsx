import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
} from 'lucide-react-native';
import { useThemeColors } from '@/stores/themeStore';

const CATEGORIES = [
  { id: 'growth', label: '성장', emoji: '🌱' },
  { id: 'wisdom', label: '지혜', emoji: '💡' },
  { id: 'emotion', label: '감성', emoji: '🌊' },
  { id: 'relation', label: '관계', emoji: '🤝' },
  { id: 'motivation', label: '동기', emoji: '⚡', full: true },
];

export default function QuotePrefScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(['growth', 'wisdom']);
  const colors = useThemeColors();

  const toggleCategory = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgDeep }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>명언 선호 재설정</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>관심 있는 주제를 다시 선택해주세요</Text>
          <Text style={[styles.heroCurrent, { color: colors.textSecondary }]}>
            현재 선택: <Text style={styles.highlight}>{selected.map(id => CATEGORIES.find(c => c.id === id)?.label).join(', ')}</Text>
          </Text>
        </View>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => {
            const isActive = selected.includes(cat.id);
            return (
              <Pressable
                key={cat.id}
                style={[
                  styles.card,
                  { backgroundColor: colors.bgSurface },
                  cat.full && styles.cardFull,
                  isActive && styles.cardActive
                ]}
                onPress={() => toggleCategory(cat.id)}
              >
                <Text style={styles.emoji}>{cat.emoji}</Text>
                <Text style={[styles.cardLabel, { color: colors.textSecondary }, isActive && styles.cardLabelActive]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.footerInfo, { color: colors.textSecondary }]}>선택한 주제 중심으로 명언을 추천해드려요</Text>

        <View style={styles.footer}>
          <Pressable style={styles.ctaBtn} onPress={() => router.back()}>
            <Text style={styles.ctaBtnText}>저장하기</Text>
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
  hero: {
    marginTop: 12,
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4F3EF',
    marginBottom: 8,
  },
  heroCurrent: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.4)',
    fontWeight: '500',
  },
  highlight: {
    color: '#E8491E',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: (Dimensions.get('window').width - 40 - 12) / 2,
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardFull: {
    width: '100%',
    aspectRatio: 1.8,
  },
  cardActive: {
    backgroundColor: 'rgba(232, 73, 30, 0.08)',
    borderColor: 'rgba(232, 73, 30, 0.4)',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(244,243,239,0.4)',
  },
  cardLabelActive: {
    color: '#E8491E',
  },
  footerInfo: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.2)',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footer: {
    marginTop: 'auto',
  },
  ctaBtn: {
    backgroundColor: '#E8491E',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E8491E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
