import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Sun, Moon, Smartphone, Check } from 'lucide-react-native';
import { useThemeStore, useThemeColors } from '@/stores/themeStore';

type ThemeMode = 'system' | 'light' | 'dark';

const THEME_OPTIONS: { id: ThemeMode; label: string; desc: string; icon: typeof Sun }[] = [
  {
    id: 'system',
    label: '시스템 설정',
    desc: '기기의 설정에 따라 자동으로 전환됩니다.',
    icon: Smartphone,
  },
  {
    id: 'light',
    label: '라이트 모드',
    desc: '밝은 배경의 화면으로 표시됩니다.',
    icon: Sun,
  },
  {
    id: 'dark',
    label: '다크 모드',
    desc: '어두운 배경의 화면으로 표시됩니다.',
    icon: Moon,
  },
];

export default function SystemThemeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const themeStore = useThemeStore();
  const colors = useThemeColors();
  const selected = themeStore.colorMode;

  const handleSelect = (mode: ThemeMode) => {
    themeStore.setColorMode(mode);
  };

  // Preview colors for each option
  const getPreviewColors = (mode: ThemeMode) => {
    let isPreviewDark = false;
    if (mode === 'dark') isPreviewDark = true;
    if (mode === 'system') isPreviewDark = colors.isDark; // Fallback to current system state

    return {
      bg: isPreviewDark ? '#111111' : '#EEEDE8',
      surface: isPreviewDark ? '#1F2937' : '#FFFFFF',
      text: isPreviewDark ? '#F4F3EF' : '#2C2B27',
      primary: '#E8491E',
    };
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.bgDeep }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>시스템 테마</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Description */}
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        앱의 전체 화면 모드를 선택하세요.
      </Text>

      {/* Theme Options */}
      <View style={[styles.optionGroup, { backgroundColor: colors.bgSurface, borderColor: colors.divider }]}>
        {THEME_OPTIONS.map((option, idx) => {
          const isSelected = selected === option.id;
          const IconComponent = option.icon;
          const preview = getPreviewColors(option.id);
          return (
            <React.Fragment key={option.id}>
              <Pressable
                style={[styles.optionItem, isSelected && styles.optionItemActive]}
                onPress={() => handleSelect(option.id)}
              >
                <View style={[styles.iconCircle, { backgroundColor: colors.divider }, isSelected && { backgroundColor: colors.actionCta }]}>
                  <IconComponent
                    size={20}
                    color={isSelected ? '#FFFFFF' : colors.textSecondary}
                  />
                </View>
                <View style={styles.optionText}>
                  <Text style={[
                    styles.optionLabel, 
                    { color: colors.textPrimary }, 
                    isSelected && { color: colors.actionCta }
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>{option.desc}</Text>
                  
                  {/* Theme Preview Block */}
                  <View style={[styles.previewBlock, { backgroundColor: preview.bg }]}>
                    <View style={[styles.previewSurface, { backgroundColor: preview.surface }]}>
                      <View style={[styles.previewLine, { backgroundColor: preview.text, width: '60%' }]} />
                      <View style={[styles.previewLine, { backgroundColor: preview.primary, width: '40%' }]} />
                    </View>
                  </View>
                </View>
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: colors.actionCta }]}>
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </Pressable>
              {idx < THEME_OPTIONS.length - 1 && <View style={[styles.divider, { backgroundColor: colors.divider }]} />}
            </React.Fragment>
          );
        })}
      </View>

      {/* Current Status */}
      <View style={[styles.currentStatus, { backgroundColor: colors.bgSurface }]}>
        <Text style={[styles.currentLabel, { color: colors.textSecondary }]}>현재 적용 중</Text>
        <Text style={[styles.currentValue, { color: colors.actionCta }]}>
          {THEME_OPTIONS.find(o => o.id === selected)?.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F4F3EF',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.4)',
    paddingHorizontal: 24,
    marginBottom: 24,
    lineHeight: 20,
  },
  optionGroup: {
    marginHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  optionItemActive: {
    backgroundColor: 'rgba(232,73,30,0.06)',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: '#E8491E',
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F3EF',
    marginBottom: 2,
  },
  optionLabelActive: {
    color: '#FFFFFF',
  },
  optionDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  previewBlock: {
    height: 40,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  previewSurface: {
    flex: 1,
    borderRadius: 4,
    padding: 6,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewLine: {
    height: 4,
    borderRadius: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
  },
  currentStatus: {
    marginTop: 32,
    marginHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
  },
  currentLabel: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.4)',
    fontWeight: '500',
  },
  currentValue: {
    fontSize: 14,
    color: '#E8491E',
    fontWeight: '700',
  },
});
