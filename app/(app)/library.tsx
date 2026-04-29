import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Bookmark,
  ArrowRight,
} from 'lucide-react-native';

const MOCK_SAVED = [
  {
    id: 's_1',
    text: '성장은 편안함의 경계 너머에 있다',
    author: '존 맥스웰',
    category: '성장',
    categoryColor: '#E8491E',
    date: '04.27',
  },
  {
    id: 's_2',
    text: '우리가 두려워해야 할 유일한 것은 두려움 자체다',
    author: '루즈벨트',
    category: '동기',
    categoryColor: '#D97706',
    date: '04.25',
  },
  {
    id: 's_3',
    text: '행복은 습관이다. 그것을 몸에 붙여라.',
    author: '허버드',
    category: '감성',
    categoryColor: '#0079c3',
    date: '04.22',
  },
];

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState('저장 순');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#F4F3EF" />
          </Pressable>
          <Text style={styles.headerTitle}>보관함</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>28 / 30</Text>
          </View>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '93%' }]} />
        </View>
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        {['저장 순', '카테고리', '가나다'].map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <ScrollView 
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_SAVED.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.tagWrapper}>
                <View style={[styles.tagDot, { backgroundColor: item.categoryColor }]} />
                <Text style={styles.tagText}>{item.category}</Text>
              </View>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
            
            <Text style={styles.quoteText}>"{item.text}"</Text>
            <Text style={styles.authorText}>— {item.author}</Text>

            <View style={styles.cardFooter}>
              <Pressable style={styles.unsaveBtn}>
                <Bookmark size={16} color="#E8491E" fill="#E8491E" />
                <Text style={styles.unsaveText}>해제</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {/* Ad Banner */}
        <Pressable style={styles.adBanner}>
          <View style={styles.adLeft}>
            <Text style={styles.adTitle}>더 저장하려면?</Text>
            <Text style={styles.adDesc}>광고를 보면 +20개 공간이 생겨요</Text>
          </View>
          <View style={styles.adAction}>
            <Text style={styles.adActionText}>광고 보기</Text>
            <ArrowRight size={14} color="#FFFFFF" />
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 32,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#F4F3EF',
    marginLeft: 8,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
  },
  countText: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.5)',
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E8491E',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  filterChipActive: {
    backgroundColor: '#E8491E',
  },
  filterChipText: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.4)',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 6,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(244,243,239,0.8)',
  },
  cardDate: {
    fontSize: 11,
    color: 'rgba(244,243,239,0.25)',
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(244,243,239,0.85)',
    lineHeight: 24,
    marginBottom: 8,
  },
  authorText: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.4)',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  unsaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(232, 73, 30, 0.1)',
  },
  unsaveText: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.6)',
    fontWeight: '600',
  },
  adBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1412',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(232, 73, 30, 0.2)',
    marginTop: 8,
  },
  adLeft: {
    flex: 1,
  },
  adTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8491E',
    marginBottom: 4,
  },
  adDesc: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.5)',
  },
  adAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E8491E',
    borderRadius: 12,
  },
  adActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
