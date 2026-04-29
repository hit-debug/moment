import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronRight } from 'lucide-react-native';
import { useOnboardingStore } from '@/stores/onboardingStore';

const CATEGORIES = [
  { id: '1', name: '동기부여' },
  { id: '2', name: '성공' },
  { id: '3', name: '자존감' },
  { id: '4', name: '사랑' },
  { id: '5', name: '인간관계' },
  { id: '6', name: '휴식' },
  { id: '7', name: '철학' },
  { id: '8', name: '도전' },
  { id: '9', name: '위로' },
  { id: '10', name: '지혜' },
  { id: '11', name: '용기' },
  { id: '12', name: '행복' },
];

export default function OnboardingStartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setCategories } = useOnboardingStore();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleCategory = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size < 3) next.add(id);
      }
      return next;
    });
  };

  const handleNext = () => {
    setCategories(Array.from(selected));
    router.push('/onboarding/setup');
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>
            어떤 문장들이{'\n'}필요하신가요?
          </Text>
          <Text style={styles.subtitle}>
            관심 있는 주제를 최대 3개까지 선택해주세요.
          </Text>
        </View>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => {
            const isSelected = selected.has(cat.id);
            return (
              <Pressable
                key={cat.id}
                onPress={() => toggleCategory(cat.id)}
                style={[
                  styles.card,
                  isSelected && styles.cardActive,
                ]}
              >
                <Text style={[styles.cardText, isSelected && styles.cardTextActive]}>
                  {cat.name}
                </Text>
                {isSelected && (
                  <View style={styles.iconWrapper}>
                    <Check size={14} color="#111111" strokeWidth={3} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, selected.size === 0 && styles.buttonDisabled]}
          disabled={selected.size === 0}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {selected.size > 0 ? `${selected.size}개 선택완료` : '주제를 선택해주세요'}
          </Text>
          <ChevronRight size={20} color={selected.size > 0 ? '#111111' : 'rgba(244,243,239,0.3)'} />
        </Pressable>
      </View>
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
    paddingTop: 48,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#F4F3EF',
    lineHeight: 40,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.65)',
    marginTop: 12,
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flexBasis: '48%',
    flexGrow: 1,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  cardActive: {
    backgroundColor: '#F4F3EF',
    borderColor: '#F4F3EF',
  },
  cardText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(244,243,239,0.85)',
    letterSpacing: 0.5,
  },
  cardTextActive: {
    color: '#111111',
    fontWeight: '600',
  },
  iconWrapper: {
    position: 'absolute',
    right: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    backgroundColor: '#111111',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  button: {
    height: 56,
    backgroundColor: '#F4F3EF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    letterSpacing: 0.5,
  },
});
