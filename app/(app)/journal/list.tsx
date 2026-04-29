import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Share2,
  PenLine,
  Search,
  ChevronDown,
} from 'lucide-react-native';

const { width: SCREEN_W } = Dimensions.get('window');

interface JournalEntry {
  id: string;
  date: string;
  quoteText: string;
  author: string;
  userText: string;
}

const MOCK_JOURNALS: JournalEntry[] = [
  {
    id: 'j_1',
    date: '2026년 4월 28일',
    quoteText: '행동이 두려움을 없앤다',
    author: '인디라 간디',
    userText: '오늘 시작한 것만으로도 충분하다. 어제보다 조금 나은 오늘이면 된다.',
  },
  {
    id: 'j_2',
    date: '2026년 4월 27일',
    quoteText: '성장은 편안함의 경계 너머에 있다',
    author: '존 맥스웰',
    userText: '오늘 새벽에 읽고 마음이 흔들렸다. 정말 편안한 자리를 떠날 용기가 있을까?',
  },
  {
    id: 'j_3',
    date: '2026년 4월 25일',
    quoteText: '두려워해야 할 유일한 것은 두려움 자체다',
    author: '루즈벨트',
    userText: '면접 전날 이 문장을 읽었다. 심호흡하고 들어갔더니 생각보다 잘 됐다.',
  },
  {
    id: 'j_4',
    date: '2026년 4월 10일',
    quoteText: '시작이 반이다',
    author: '아리스토텔레스',
    userText: '오랫동안 미뤄왔던 운동을 오늘 드디어 시작했다.',
  },
];

const FILTER_TABS = ['전체', '오늘', '이번 주', '월 선택'];

export default function JournalListScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('전체');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Area */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>저널</Text>
          <Text style={styles.headerCount}>총 {MOCK_JOURNALS.length}개</Text>
        </View>
        <Pressable style={styles.searchBtn}>
          <Search size={22} color="rgba(244,243,239,0.7)" strokeWidth={2} />
        </Pressable>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.filterTab,
                  isActive && styles.filterTabActive,
                  tab === '월 선택' && styles.monthTab
                ]}
              >
                <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                  {tab}
                </Text>
                {tab === '월 선택' && (
                  <ChevronDown size={14} color={isActive ? '#FFFFFF' : 'rgba(244,243,239,0.45)'} style={{ marginLeft: 4 }} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Journal List */}
      <ScrollView 
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_JOURNALS.map((entry) => (
          <View key={entry.id} style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{entry.date}</Text>
              <View style={styles.cardActions}>
                <Pressable style={styles.actionBtn}>
                  <Share2 size={16} color="rgba(244,243,239,0.6)" />
                  <Text style={styles.actionBtnText}>공유</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, styles.editBtn]}>
                  <PenLine size={16} color="#E8491E" />
                  <Text style={[styles.actionBtnText, styles.editBtnText]}>수정</Text>
                </Pressable>
              </View>
            </View>

            {/* Quote Section */}
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>"{entry.quoteText}"</Text>
              <Text style={styles.authorText}>— {entry.author}</Text>
            </View>

            {/* User Text Section */}
            <View style={styles.userTextBox}>
              <Text style={styles.userText}>{entry.userText}</Text>
            </View>
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F4F3EF',
    letterSpacing: -0.5,
  },
  headerCount: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.4)',
    marginTop: 2,
  },
  searchBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#E8491E',
  },
  monthTab: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  filterTabText: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.45)',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
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
    marginBottom: 16,
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.4)',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  actionBtnText: {
    fontSize: 11,
    color: 'rgba(244,243,239,0.7)',
    fontWeight: '500',
  },
  editBtn: {
    borderColor: 'rgba(232, 73, 30, 0.2)',
    borderWidth: 1,
  },
  editBtnText: {
    color: '#E8491E',
  },
  quoteBox: {
    borderLeftWidth: 2,
    borderLeftColor: '#00609b', // Blue accent from screenshot
    paddingLeft: 12,
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(244,243,239,0.85)',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  authorText: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.4)',
    marginTop: 4,
  },
  userTextBox: {
    paddingTop: 8,
  },
  userText: {
    fontSize: 15,
    color: '#F4F3EF',
    lineHeight: 24,
    fontWeight: '400',
  },
});
