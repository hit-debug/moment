import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { lightColors } from '@/tokens/colors';
import { spacing, borderRadius } from '@/tokens/spacing';
import { typography } from '@/tokens/typography';

const { width: SCREEN_W } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // 애니메이션 값
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. 진입 애니메이션 (500ms spring, DSG §8)
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    // 2. 프로그레스 애니메이션 (2초간 1/3 진행)
    Animated.timing(progressAnim, {
      toValue: 1, // 1은 1/3 지점을 의미 (스플래시 한정)
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false, // width 변경은 native driver 지원 안함
    }).start(({ finished }) => {
      if (finished) {
        // 3. 2초 후 자동 라우팅
        router.replace('/(app)/quote');
      }
    });
  }, [fadeAnim, progressAnim, router]);

  // 진행률 width 계산 (최대 48px의 1/3 = 16px)
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  return (
    <View style={styles.container}>
      {/* 배경 이펙트 (원형 블러 시뮬레이션) */}
      <View style={[styles.bgEffect, { pointerEvents: 'none' }]} />

      {/* 메인 콘텐츠 (페이드인 애니메이션) */}
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        
        {/* 장식 아이콘 (bubble_chart 대용 3개 원형) - 접근성 숨김 */}
        <View style={styles.iconCluster} accessible={false}>
          <View style={[styles.bubble, styles.bubbleLarge]} />
          <View style={[styles.bubble, styles.bubbleMedium]} />
          <View style={[styles.bubble, styles.bubbleSmall]} />
        </View>

        {/* 로고 */}
        <Text 
          style={styles.logo} 
          accessibilityRole="header"
          accessibilityLabel="Moment"
        >
          Moment
        </Text>

        {/* 태그라인 */}
        <Text style={styles.tagline}>
          매일의 영감과 평온을 기록하는 순간
        </Text>

      </Animated.View>

      {/* 하단 프로그레스 영역 */}
      <View style={styles.bottomContainer}>
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.versionText}>V1.0.4</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111', // Dark Theme
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgEffect: {
    position: 'absolute',
    width: SCREEN_W * 0.8,
    height: SCREEN_W * 0.8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.02)', // Subtle effect
    opacity: 0.4,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconCluster: {
    width: 64,
    height: 64,
    position: 'relative',
    marginBottom: spacing.space2,
  },
  bubble: {
    position: 'absolute',
    borderRadius: borderRadius.pill,
    backgroundColor: '#F4F3EF',
    opacity: 0.1,
  },
  bubbleLarge: {
    width: 28,
    height: 28,
    top: 4,
    right: 4,
  },
  bubbleMedium: {
    width: 20,
    height: 20,
    bottom: 8,
    left: 8,
  },
  bubbleSmall: {
    width: 14,
    height: 14,
    bottom: 4,
    right: 18,
  },
  logo: {
    fontSize: 32,
    color: '#F4F3EF',
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.6)',
    marginTop: spacing.space2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: spacing.space12,
    alignItems: 'center',
    width: '100%',
  },
  progressBarTrack: {
    width: 48,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
    marginBottom: spacing.space4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F4F3EF',
    opacity: 0.8,
    borderRadius: borderRadius.pill,
  },
  versionText: {
    fontSize: 10,
    color: 'rgba(244,243,239,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
