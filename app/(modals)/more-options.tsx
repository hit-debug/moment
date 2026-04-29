import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, EyeOff, AlertTriangle, MessageSquare } from 'lucide-react-native';

export default function MoreOptionsModal() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const options = [
    { icon: EyeOff, label: '이 명언 다시 보지 않기', color: '#F4F3EF' },
    { icon: MessageSquare, label: '오타 또는 잘못된 정보 신고', color: '#F4F3EF' },
    { icon: AlertTriangle, label: '부적절한 배경 이미지 신고', color: '#EF4444' },
  ];

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.handle} />
        
        <View style={styles.header}>
          <Text style={styles.title}>더 보기</Text>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <X size={24} color="rgba(244,243,239,0.5)" />
          </Pressable>
        </View>

        <View style={styles.optionsList}>
          {options.map((opt, idx) => (
            <Pressable key={idx} style={styles.optionItem}>
              <opt.icon size={22} color={opt.color} style={{ marginRight: 16 }} />
              <Text style={[styles.optionLabel, { color: opt.color }]}>{opt.label}</Text>
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
