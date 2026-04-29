import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShieldCheck, Activity } from 'lucide-react-native';

export default function OnboardingAttScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    // 실제 환경에서는 여기서 권한 요청 로직이 실행됩니다.
    router.push('/onboarding/widget');
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.content}>
        
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <ShieldCheck size={32} color="#F4F3EF" strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>
            맞춤형 문장 추천을 위한{'\n'}권한 안내
          </Text>
          <Text style={styles.subtitle}>
            Moment는 사용자의 앱 사용 패턴을 분석하여{'\n'}가장 필요한 순간에 적절한 문장을 추천해 드립니다.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Activity size={24} color="#E8491E" strokeWidth={2} />
            </View>
            <View style={styles.rowTextWrapper}>
              <Text style={styles.rowTitle}>활동 정보 기반 추천</Text>
              <Text style={styles.rowDesc}>더 나은 영감을 제공하기 위해 기기 내 활동 정보를 활용합니다.</Text>
            </View>
          </View>
        </View>

      </View>

      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          이 권한은 언제든지 기기 설정에서 변경할 수 있습니다.{'\n'}허용하지 않아도 앱의 기본 기능을 이용할 수 있습니다.
        </Text>
        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>계속하기</Text>
        </Pressable>
        <Pressable style={styles.skipButton} onPress={handleNext}>
          <Text style={styles.skipText}>나중에 하기</Text>
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
    justifyContent: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 26,
    fontWeight: '300',
    color: '#F4F3EF',
    lineHeight: 38,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.65)',
    marginTop: 16,
    lineHeight: 22,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  rowIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(232, 73, 30, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextWrapper: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F3EF',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  rowDesc: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.6)',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.4)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  button: {
    height: 56,
    backgroundColor: '#E8491E',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  skipButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.5)',
    fontWeight: '500',
  },
});
