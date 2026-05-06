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
import { useThemeColors } from '@/stores/themeStore';
import {
  Share2,
  PenLine,
  Search,
  ChevronDown,
  X,
  Trash2,
} from 'lucide-react-native';

const { width: SCREEN_W } = Dimensions.get('window');

import { useJournalStore } from '@/stores/journalStore';

const FILTER_TABS = ['전체', '오늘', '이번 주', '월 선택'];

export default function JournalListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState('전체');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const { journals, deleteJournal } = useJournalStore();

  const filteredJournals = useMemo(() => {
    return journals.filter(entry => {
      if (activeTab === '오늘') {
        if (!entry.date.includes('4월 28일')) return false;
      } else if (activeTab === '이번 주') {
        if (!['4월 28일', '4월 27일', '4월 25일'].some(d => entry.date.includes(d))) return false;
      } else if (activeTab.includes('월')) {
        if (!entry.date.includes(activeTab)) return false;
      }

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
    setShowMonthSelect(true);
  };

  const handleSelectMonth = (month: string) => {
    setActiveTab(month);
    setShowMonthSelect(false);
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

  const handleEdit = (entry: any) => {
    if (!entry.date.includes('4월 28일')) {
      if (Platform.OS === 'web') {
        window.alert('수정은 당일 작성한 저널만 가능합니다.');
      } else {
        Alert.alert('수정 불가', '수정은 당일 작성한 저널만 가능합니다.');
      }
      return;
    }
    router.push({
      pathname: '/(modals)/journal-write',
      params: { id: entry.id, content: entry.userText }
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
            deleteJournal(id);
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.bgDeep }]}>
      <View style={styles.header}>
        {!isSearchActive ? (
          <>
            <View>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>저널</Text>
              <Text style={[styles.headerCount, { color: colors.textSecondary }]}>총 {filteredJournals.length}개</Text>
            </View>
            <Pressable style={styles.searchBtn} onPress={() => setIsSearchActive(true)}>
              <Search size={22} color={colors.textSecondary} strokeWidth={2} />
            </Pressable>
          </>
        ) : (
          <View style={styles.searchContainer}>
            <View style={[styles.searchInputWrapper, { backgroundColor: colors.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
              <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="저널 내용, 명언 검색"
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <X size={18} color={colors.textSecondary} />
                </Pressable>
              )}
            </View>
            <Pressable style={styles.cancelBtn} onPress={() => {
              setIsSearchActive(false);
              setSearchQuery('');
            }}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>취소</Text>
            </Pressable>
          </View>
        )}
      </View>

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
                    { backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
                    tab === '월 선택' && styles.monthTab,
                    (isActive || (tab === '월 선택' && (activeTab === '4월' || activeTab === '3월'))) && { backgroundColor: colors.actionCta }
                  ]}
                >
                  <Text style={[
                    styles.filterTabText, 
                    { color: colors.textSecondary },
                    (isActive || (tab === '월 선택' && (activeTab === '4월' || activeTab === '3월'))) && { color: '#FFFFFF' }
                  ]}>
                    {tab === '월 선택' && (activeTab === '4월' || activeTab === '3월') ? activeTab : tab}
                  </Text>
                  {tab === '월 선택' && (
                    <ChevronDown size={14} color={(isActive || activeTab === '4월' || activeTab === '3월') ? '#FFFFFF' : colors.textSecondary} style={{ marginLeft: 4 }} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredJournals.map((entry) => (
          <View key={entry.id} style={[styles.card, { backgroundColor: colors.bgSurface, borderColor: colors.divider }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>{entry.date}</Text>
              <View style={styles.cardActions}>
                <Pressable 
                  style={[styles.actionBtn, { backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]} 
                  onPress={() => handleShare(entry)}
                >
                  <Share2 size={14} color={colors.textSecondary} />
                  <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>공유</Text>
                </Pressable>
                {entry.date.includes('4월 28일') && (
                  <Pressable 
                    style={[styles.actionBtn, styles.editBtn, { borderColor: colors.actionCta + '40' }]} 
                    onPress={() => handleEdit(entry)}
                  >
                    <PenLine size={14} color={colors.actionCta} />
                    <Text style={[styles.actionBtnText, { color: colors.actionCta }]}>수정</Text>
                  </Pressable>
                )}
                <Pressable style={styles.deleteBtn} onPress={() => handleDelete(entry.id)}>
                  <X size={16} color="rgba(244,243,239,0.3)" />
                </Pressable>
              </View>
            </View>

            {/* Quote Section (디자인 튜닝 적용) */}
            <View style={styles.quoteBox}>
              <Text style={[styles.quoteText, { color: colors.textPrimary }]}>"{entry.quoteText}"</Text>
              <Text style={[styles.authorText, { color: colors.textSecondary }]}>— {entry.author}</Text>
            </View>

            {/* User Text Section */}
            <View style={styles.userTextBox}>
              <Text style={[styles.userText, { color: colors.textPrimary }]}>{entry.userText}</Text>
            </View>
          </View>
        ))}

        {/* PRD Empty State 분기 처리 */}
        {filteredJournals.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <PenLine size={32} color="rgba(244,243,239,0.15)" />
            </View>
            
            {isSearchActive || (activeTab !== '전체' && MOCK_JOURNALS.length > 0) ? (
              // 검색 결과 없음 또는 특정 탭 필터 결과 없음
              <>
                <Text style={[styles.emptyText, { color: colors.textPrimary }]}>검색 결과가 없습니다.</Text>
                <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>다른 키워드로 검색해 보거나{"\n"}전체 탭에서 기록을 확인해 보세요.</Text>
              </>
            ) : (
              // 전체 기록이 없는 경우 (PRD R-009)
              <>
                <Text style={[styles.emptyText, { color: colors.textPrimary }]}>아직 작성한 저널이 없어요.</Text>
                <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>지금 명언에 대한 첫 번째 기록을 남겨보세요.</Text>
                <Pressable style={styles.homeBtn} onPress={() => router.push('/(app)/quote')}>
                  <Text style={styles.homeBtnText}>명언 보러 가기</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Month Selection Bottom Sheet (Web Compatible) */}
      {showMonthSelect && (
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowMonthSelect(false)} />
          <View style={[styles.actionSheet, { paddingBottom: insets.bottom + 20, backgroundColor: colors.bgSurface }]}>
            <Text style={[styles.sheetTitle, { color: colors.textSecondary }]}>월 선택</Text>
            <Pressable style={styles.sheetItem} onPress={() => handleSelectMonth('4월')}>
              <Text style={[styles.sheetItemText, { color: colors.textPrimary }]}>2026년 4월</Text>
            </Pressable>
            <Pressable style={styles.sheetItem} onPress={() => handleSelectMonth('3월')}>
              <Text style={[styles.sheetItemText, { color: colors.textPrimary }]}>2026년 3월</Text>
            </Pressable>
            <Pressable style={styles.sheetItem} onPress={() => handleSelectMonth('전체')}>
              <Text style={[styles.sheetItemText, { color: colors.textPrimary }]}>전체 보기</Text>
            </Pressable>
            <Pressable style={[styles.sheetCancelBtn, { borderTopColor: colors.divider }]} onPress={() => setShowMonthSelect(false)}>
              <Text style={[styles.sheetCancelText, { color: colors.textSecondary }]}>취소</Text>
            </Pressable>
          </View>
        </View>
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
    marginBottom: 24,
  },
  homeBtn: {
    backgroundColor: '#E8491E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  actionSheet: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sheetTitle: {
    fontSize: 16,
    color: 'rgba(244,243,239,0.5)',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  sheetItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  sheetItemText: {
    fontSize: 16,
    color: '#F4F3EF',
    textAlign: 'center',
    fontWeight: '500',
  },
  sheetCancelBtn: {
    paddingVertical: 16,
    marginTop: 8,
  },
  sheetCancelText: {
    fontSize: 16,
    color: '#E8491E',
    textAlign: 'center',
    fontWeight: '600',
  },
});
