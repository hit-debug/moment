import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, EyeOff, Bookmark, MessageSquare } from 'lucide-react-native';
import { useThemeColors } from '@/stores/themeStore';

export default function MoreOptionsModal() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useThemeColors();

  const options = [
    { icon: EyeOff, label: '이 명언 다시 보지 않기' },
    { icon: Bookmark, label: '보관함에 저장하기' },
    { icon: MessageSquare, label: '오타 또는 잘못된 정보 신고' },
  ];

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20, backgroundColor: colors.bgSurface }]}>
        <View style={[styles.handle, { backgroundColor: colors.divider }]} />
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>더 보기</Text>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <X size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.optionsList}>
          {options.map((opt, idx) => (
            <Pressable key={idx} style={styles.optionItem}>
              <opt.icon size={22} color={colors.textPrimary} style={{ marginRight: 16 }} />
              <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4F3EF',
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 4,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});
