import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function OnboardingWidgetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleComplete = () => {
    // 온보딩 완료 시 메인 피드로 이동
    router.replace('/(app)/quote/today');
  };

  return (
    <View style={styles.container}>
      <View style={styles.heroContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6' }} 
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', '#111111']}
          style={styles.heroGradient}
        />
      </View>

      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <LayoutDashboard size={28} color="#111111" strokeWidth={2} />
          </View>
          <Text style={styles.title}>
            홈 화면에서 만나는{'\n'}나만의 문장
          </Text>
          <Text style={styles.subtitle}>
            위젯을 추가하여 앱을 열지 않아도{'\n'}매일 새로운 영감을 받아보세요.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>위젯 추가 방법</Text>
          <View style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
            <Text style={styles.stepText}>홈 화면의 빈 공간을 길게 누르세요</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
            <Text style={styles.stepText}>좌측 상단의 <Text style={styles.stepHighlight}>+</Text> 버튼을 탭하세요</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
            <Text style={styles.stepText}><Text style={styles.stepHighlight}>Moment</Text> 위젯을 검색하여 추가하세요</Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>시작하기</Text>
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
  heroContainer: {
    height: '45%',
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    marginTop: -40,
    zIndex: 10,
  },
  header: {
    marginBottom: 32,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F4F3EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#F4F3EF',
    lineHeight: 40,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.65)',
    marginTop: 12,
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 40,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F3EF',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F4F3EF',
  },
  stepText: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.7)',
    flex: 1,
  },
  stepHighlight: {
    color: '#E8491E',
    fontWeight: '600',
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
