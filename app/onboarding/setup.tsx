import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Clock, ChevronRight } from 'lucide-react-native';
import { useOnboardingStore } from '@/stores/onboardingStore';

export default function OnboardingSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setPushEnabled } = useOnboardingStore();
  const [isEnabled, setIsEnabled] = useState(true);

  const handleNext = () => {
    setPushEnabled(isEnabled);
    router.push('/onboarding/att');
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            하루의 시작과 끝,{'\n'}어떤 문장을 원하시나요?
          </Text>
          <Text style={styles.subtitle}>
            원하는 시간에 맞춰 영감을 배달해 드립니다.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconBox}>
                <Bell size={20} color="#F4F3EF" strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>매일 알림 받기</Text>
            </View>
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#E8491E' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="rgba(255,255,255,0.1)"
            />
          </View>

          <View style={[styles.cardBody, !isEnabled && styles.cardBodyDisabled]}>
            <Pressable style={styles.row}>
              <View style={styles.rowLeft}>
                <Clock size={18} color="rgba(244,243,239,0.6)" />
                <Text style={styles.rowText}>시작 시간</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.valueText}>오전 08:00</Text>
                <ChevronRight size={16} color="rgba(244,243,239,0.4)" />
              </View>
            </Pressable>
            
            <View style={styles.divider} />

            <Pressable style={styles.row}>
              <View style={styles.rowLeft}>
                <Clock size={18} color="rgba(244,243,239,0.6)" />
                <Text style={styles.rowText}>종료 시간</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.valueText}>오후 10:00</Text>
                <ChevronRight size={16} color="rgba(244,243,239,0.4)" />
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>다음</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
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
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8491E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F3EF',
    letterSpacing: 0.5,
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  cardBodyDisabled: {
    opacity: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    fontSize: 15,
    color: 'rgba(244,243,239,0.85)',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#E8491E',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  button: {
    height: 56,
    backgroundColor: '#F4F3EF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    letterSpacing: 0.5,
  },
});
