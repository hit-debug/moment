import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { lightColors } from '@/tokens/colors';
import { spacing, borderRadius } from '@/tokens/spacing';
import { typography } from '@/tokens/typography';

export default function LoginPromptModal() {
  const router = useRouter();

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/quote/today');
    }
  };

  const handleAppleLogin = () => {
    // TODO: Apple 로그인 구현
    handleClose();
  };

  const handleGoogleLogin = () => {
    // TODO: Google 로그인 구현
    handleClose();
  };

  return (
    <View style={styles.overlay}>
      {/* 바깥 영역 터치 시 닫기 */}
      <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

      {/* 바텀 시트 컨테이너 */}
      <View style={styles.bottomSheet}>
        {/* 핸들 (모바일 전용 시각적 힌트) */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

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
            onPress={handleClose}
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
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.4)', // bg-stone-900/40
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: lightColors.bgSurface,
    borderTopLeftRadius: borderRadius.modal,
    borderTopRightRadius: borderRadius.modal,
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.space6, // Safe area 하단 여백 대응
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.08,
        shadowRadius: 40,
      },
      android: {
        elevation: 20,
      },
      web: {
        boxShadow: '0 -10px 40px rgba(0,0,0,0.08)',
      },
    }),
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: spacing.space3,
    paddingBottom: spacing.space2,
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: '#E5E5E4', // bg-stone-200
    borderRadius: borderRadius.pill,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.space8,
    paddingTop: spacing.space6,
    paddingBottom: spacing.space12,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.pill,
    backgroundColor: '#FFE9E4', // surface-container
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.space6,
  },
  iconText: {
    fontSize: 28,
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
    borderColor: '#E5E5E4', // border-stone-200
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space8,
    paddingBottom: spacing.space8,
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
