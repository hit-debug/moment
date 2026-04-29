import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Share2,
  PenLine,
  Search,
  ChevronDown,
  X,
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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('전체');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJournals = useMemo(() => {
    return MOCK_JOURNALS.filter(entry => {
      // 1. Tab Filter
      if (activeTab === '오늘') {
        if (!entry.date.includes('4월 28일')) return false; // Simple mock check
      }

      // 2. Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          entry.quoteText.toLowerCase().includes(query) ||
          entry.userText.toLowerCase().includes(query) ||
          entry.author.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  const handleMonthPress = () => {
    Alert.alert(
      '월 선택',
      '조회할 월을 선택해 주세요.',
      [
        { text: '2026년 4월', onPress: () => setActiveTab('4월') },
        { text: '2026년 3월', onPress: () => setActiveTab('3월') },
        { text: '취소', style: 'cancel' }
      ]
    );
  };

  const handleTabPress = (tab: string) => {
    if (tab === '월 선택') {
      handleMonthPress();
    } else {
      setActiveTab(tab);
    }
  };

  const handleShare = (entry: JournalEntry) => {
    router.push({
      pathname: '/(modals)/quote-share',
      params: { 
        quote: entry.quoteText,
        author: entry.author,
        content: entry.userText 
      }
    });
  };

  const handleEdit = (entry: JournalEntry) => {
    router.push({
      pathname: '/(modals)/journal-write',
      params: { content: entry.userText }
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      '저널 삭제',
      '정말로 이 저널을 삭제하시겠습니까? 삭제된 기록은 복구할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => {
            // In a real app, call API/Store here
            Alert.alert('삭제 완료', '저널이 삭제되었습니다.');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Area */}
      <View style={styles.header}>
        {!isSearchActive ? (
          <>
            <View>
              <Text style={styles.headerTitle}>저널</Text>
              <Text style={styles.headerCount}>총 {filteredJournals.length}개</Text>
            </View>
            <Pressable style={styles.searchBtn} onPress={() => setIsSearchActive(true)}>
              <Search size={22} color="rgba(244,243,239,0.7)" strokeWidth={2} />
            </Pressable>
          </>
        ) : (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Search size={18} color="rgba(244,243,239,0.4)" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="저널 내용, 명언 검색"
                placeholderTextColor="rgba(244,243,239,0.3)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <X size={18} color="rgba(244,243,239,0.4)" />
                </Pressable>
              )}
            </View>
            <Pressable style={styles.cancelBtn} onPress={() => {
              setIsSearchActive(false);
              setSearchQuery('');
            }}>
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Filter Tabs */}
      {!isSearchActive && (
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
                  onPress={() => handleTabPress(tab)}
                  style={[
                    styles.filterTab,
                    (isActive || (tab === '월 선택' && (activeTab === '4월' || activeTab === '3월'))) && styles.filterTabActive,
                    tab === '월 선택' && styles.monthTab
                  ]}
                >
                  <Text style={[styles.filterTabText, (isActive || (tab === '월 선택' && (activeTab === '4월' || activeTab === '3월'))) && styles.filterTabTextActive]}>
                    {tab === '월 선택' && (activeTab === '4월' || activeTab === '3월') ? activeTab : tab}
                  </Text>
                  {tab === '월 선택' && (
                    <ChevronDown size={14} color={(isActive || activeTab === '4월' || activeTab === '3월') ? '#FFFFFF' : 'rgba(244,243,239,0.45)'} style={{ marginLeft: 4 }} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Journal List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredJournals.map((entry) => (
          <View key={entry.id} style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{entry.date}</Text>
              <View style={styles.cardActions}>
                <Pressable style={styles.actionBtn} onPress={() => handleShare(entry)}>
                  <Share2 size={16} color="rgba(244,243,239,0.6)" />
                  <Text style={styles.actionBtnText}>공유</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, styles.editBtn]} onPress={() => handleEdit(entry)}>
                  <PenLine size={16} color="#E8491E" />
                  <Text style={[styles.actionBtnText, styles.editBtnText]}>수정</Text>
                </Pressable>
                <Pressable style={styles.deleteBtn} onPress={() => handleDelete(entry.id)}>
                  <X size={16} color="rgba(244,243,239,0.3)" />
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

        {filteredJournals.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <PenLine size={32} color="rgba(244,243,239,0.15)" />
            </View>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            <Text style={styles.emptySubText}>다른 키워드로 검색해 보거나{"\n"}전체 탭에서 기록을 확인해 보세요.</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {!isSearchActive && (
        <Pressable 
          style={[styles.fab, { bottom: insets.bottom + 24 }]}
          onPress={() => router.push('/(modals)/journal-write')}
        >
          <PenLine size={24} color="#FFFFFF" />
        </Pressable>
      )}
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
  deleteBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginLeft: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F4F3EF',
    fontSize: 15,
    paddingVertical: 8,
  },
  cancelBtn: {
    paddingHorizontal: 4,
  },
  cancelText: {
    color: '#E8491E',
    fontSize: 15,
    fontWeight: '500',
  },
  emptyContainer: {
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(244,243,239,0.7)',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.3)',
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8491E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#E8491E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
