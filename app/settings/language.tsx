import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check } from 'lucide-react-native';
import { darkColors } from '@/tokens/colors';

const LANGUAGES = [
  { id: 'ko', name: '한국어', native: '한국어' },
  { id: 'en', name: 'English', native: 'English' },
  { id: 'jp', name: 'Japanese', native: '日本語' },
];

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState('ko');
  const colors = darkColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.bgDeep }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>언어 설정</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            앱의 인터페이스 언어를 변경합니다.{'\n'}명언 콘텐츠의 언어는 별도로 유지됩니다.
          </Text>
        </View>

        <View style={styles.list}>
          {LANGUAGES.map((lang) => (
            <Pressable 
              key={lang.id} 
              style={[styles.item, selected === lang.id && styles.itemActive]}
              onPress={() => setSelected(lang.id)}
            >
              <View>
                <Text style={styles.itemName}>{lang.native}</Text>
                <Text style={styles.itemSub}>{lang.name}</Text>
              </View>
              {selected === lang.id && (
                <Check size={20} color="#E8491E" strokeWidth={3} />
              )}
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>변경사항 저장</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 100,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F4F3EF',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  infoBox: {
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.4)',
    lineHeight: 22,
  },
  list: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  itemActive: {
    backgroundColor: 'rgba(232, 73, 30, 0.03)',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F3EF',
  },
  itemSub: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.3)',
    marginTop: 2,
  },
  saveBtn: {
    marginTop: 40,
    backgroundColor: '#E8491E',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
