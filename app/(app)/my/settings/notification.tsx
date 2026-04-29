import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Minus,
  Plus,
} from 'lucide-react-native';
import { darkColors } from '@/tokens/colors';

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(true);
  const [frequency, setFrequency] = useState(4);

  const colors = darkColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.bgDeep }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>알림 설정</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Toggle Section */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>명언 알림 받기</Text>
              <Text style={styles.rowDesc}>하루의 시작을 명언으로</Text>
            </View>
            <Switch
              trackColor={{ false: '#3A3A3C', true: '#E8491E' }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isEnabled ? '#FFFFFF' : '#F4F3EF'}
              ios_backgroundColor="#3A3A3C"
              onValueChange={setIsEnabled}
              value={isEnabled}
            />
          </View>
        </View>

        {/* Frequency Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>하루 알림 횟수</Text>
          <View style={styles.frequencyControl}>
            <Pressable 
              style={styles.controlBtn} 
              onPress={() => setFrequency(Math.max(1, frequency - 1))}
            >
              <Minus size={20} color="rgba(244,243,239,0.4)" strokeWidth={3} />
            </Pressable>
            <Text style={styles.frequencyValue}>
              <Text style={styles.freqHighlight}>{frequency}</Text> 회
            </Text>
            <Pressable 
              style={styles.controlBtn} 
              onPress={() => setFrequency(Math.min(10, frequency + 1))}
            >
              <Plus size={20} color="rgba(244,243,239,0.4)" strokeWidth={3} />
            </Pressable>
          </View>
        </View>

        {/* Time Range Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>알림 받을 시간대</Text>
          <View style={styles.timeRangeWrapper}>
            <View style={styles.timeCard}>
              <Text style={styles.timeCardLabel}>시작 시간</Text>
              <Text style={styles.timeValue}>오전 07:00</Text>
            </View>
            <Text style={styles.timeSeparator}>~</Text>
            <View style={styles.timeCard}>
              <Text style={styles.timeCardLabel}>종료 시간</Text>
              <Text style={styles.timeValue}>오후 22:00</Text>
            </View>
          </View>
          <Text style={styles.sectionInfo}>
            설정한 시간대 안에서 고르게 분산 발송됩니다
          </Text>
        </View>

        {/* Save Button */}
        <View style={styles.footer}>
          <Pressable style={styles.ctaBtn} onPress={() => router.back()}>
            <Text style={styles.ctaBtnText}>저장하기</Text>
          </Pressable>
        </View>
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
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F3EF',
    marginBottom: 4,
  },
  rowDesc: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.4)',
  },
  sectionLabel: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.4)',
    fontWeight: '500',
    marginBottom: 16,
  },
  frequencyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    paddingVertical: 8,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4F3EF',
    width: 60,
    textAlign: 'center',
  },
  freqHighlight: {
    color: '#E8491E',
    fontSize: 24,
  },
  timeRangeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  timeCardLabel: {
    fontSize: 11,
    color: 'rgba(244,243,239,0.3)',
    marginBottom: 6,
  },
  timeValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F4F3EF',
  },
  timeSeparator: {
    fontSize: 18,
    color: 'rgba(244,243,239,0.2)',
  },
  sectionInfo: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.2)',
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    marginTop: 24,
  },
  ctaBtn: {
    backgroundColor: '#E8491E',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E8491E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
