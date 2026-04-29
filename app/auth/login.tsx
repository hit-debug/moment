import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { lightColors } from '@/tokens/colors';
import { spacing, borderRadius } from '@/tokens/spacing';
import { typography } from '@/tokens/typography';

export default function AuthLoginScreen() {
  const router = useRouter();

  const handleSkip = () => {
    // 게스트 모드로 홈 화면 이동
    router.replace('/(app)/quote/today');
  };

  const handleAppleLogin = () => {
    // TODO: Apple 로그인 로직 연동
    // 성공 시 홈 화면으로 이동
    router.replace('/(app)/quote/today');
  };

  const handleGoogleLogin = () => {
    // TODO: Google 로그인 로직 연동
    // 성공 시 홈 화면으로 이동
    router.replace('/(app)/quote/today');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 상단 아이콘 (auto_awesome 대체) */}
        <View style={styles.iconWrapper}>
          <Text style={styles.iconText}>✨</Text>
        </View>

        {/* 타이틀 및 본문 */}
        <Text style={styles.title}>Moment와 함께 기록을 시작해보세요</Text>
        <Text style={styles.body}>
          가입하면 소중한 명언을 보관함에 저장하고, 나만의 저널을 영구적으로 기록할 수 있어요.
        </Text>

        {/* 소셜 로그인 버튼 영역 */}
        <View style={styles.buttonGroup}>
          {/* Apple 로그인 버튼 */}
          <Pressable
            style={({ pressed }) => [
              styles.btnApple,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleAppleLogin}
          >
            <Text style={styles.btnAppleText}>🍎 Apple로 계속하기</Text>
          </Pressable>

          {/* Google 로그인 버튼 */}
          <Pressable
            style={({ pressed }) => [
              styles.btnGoogle,
              pressed && { opacity: 0.6 },
            ]}
            onPress={handleGoogleLogin}
          >
            <Text style={styles.btnGoogleText}>🅖 Google로 계속하기</Text>
          </Pressable>
        </View>

        {/* 나중에 하기 (Ghost Button) */}
        <Pressable
          style={({ pressed }) => [
            styles.btnGhost,
            pressed && { opacity: 0.5 },
          ]}
          onPress={handleSkip}
        >
          <Text style={styles.btnGhostText}>나중에 하기</Text>
        </Pressable>
      </View>

      {/* 하단 장식선 */}
      <View style={styles.decorativeFooter}>
        <View style={styles.decorativeLine} />
        <Text style={styles.decorativeIcon}>🤍</Text>
        <View style={styles.decorativeLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgPrimary, // DSG v3.0: #F4F3EF
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.space8,
    paddingTop: spacing.space8,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.pill,
    backgroundColor: '#FFE9E4', // 시안의 연한 핑크 배경
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.space6,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    ...typography.typeH2,
    color: lightColors.textPrimary,
    marginBottom: spacing.space3,
    textAlign: 'center',
  },
  body: {
    ...typography.typeBodySm,
    color: lightColors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: spacing.space12,
  },
  buttonGroup: {
    width: '100%',
    gap: spacing.space3,
  },
  btnApple: {
    height: 52,
    backgroundColor: '#000000',
    borderRadius: borderRadius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAppleText: {
    ...typography.typeLabel,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  btnGoogle: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: lightColors.divider,
    borderRadius: borderRadius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGoogleText: {
    ...typography.typeLabel,
    color: lightColors.textPrimary,
    fontWeight: 'bold',
  },
  btnGhost: {
    marginTop: spacing.space6,
    paddingHorizontal: spacing.space6,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnGhostText: {
    ...typography.typeLabel,
    color: lightColors.textSecondary,
  },
  decorativeFooter: {
    position: 'absolute',
    bottom: spacing.space8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space8,
    opacity: 0.4,
  },
  decorativeLine: {
    flex: 1,
    height: 1,
    backgroundColor: lightColors.actionCta,
    opacity: 0.3,
  },
  decorativeIcon: {
    fontSize: 12,
    marginHorizontal: spacing.space2,
  },
});
