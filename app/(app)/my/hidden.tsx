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
  Eye,
  RotateCcw,
  EyeOff,
} from 'lucide-react-native';
import { useThemeColors } from '@/stores/themeStore';

const MOCK_HIDDEN = [
  {
    id: 'h_1',
    text: '성장은 편안함의 경계 너머에 있다',
    author: '존 맥스웰',
    category: '성장',
    categoryColor: '#E8491E',
    timeAgo: '3일 전',
  },
  {
    id: 'h_2',
    text: '완벽함을 기다리다 보면 아무것도 시작하지 못한다',
    author: '마거리트 셰퍼드',
    category: '동기',
    categoryColor: '#D97706',
    timeAgo: '1주 전',
  },
  {
    id: 'h_3',
    text: '지혜는 경험의 딸이다',
    author: '레오나르도 다빈치',
    category: '지혜',
    categoryColor: '#00609b',
    timeAgo: '2주 전',
  },
];

export default function HiddenScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [items, setItems] = useState(MOCK_HIDDEN);
  const colors = useThemeColors();

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const handleRestoreAll = () => {
    setItems([]);
    setIsConfirmVisible(false);
  };

  const handleRestore = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.bgDeep }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>히든함</Text>
          {items.length > 0 && (
            <Pressable onPress={() => setIsConfirmVisible(true)}>
              <Text style={[styles.restoreAllText, { color: colors.textSecondary }]}>전체 되돌리기</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.headerSub}>
          <Text style={[styles.headerCount, { color: colors.textSecondary }]}>숨긴 명언 {items.length} / 20</Text>
        </View>
      </View>

      {items.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.divider, borderColor: 'transparent' }]}>
            <EyeOff size={40} color={colors.textSecondary} strokeWidth={1.5} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>숨긴 명언이 없어요</Text>
          <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>싫어요를 누르면 이곳에 모여요</Text>
          
          <Pressable style={[styles.goBtn, { backgroundColor: colors.divider }]} onPress={() => router.push('/(app)/quote/today')}>
            <Text style={[styles.goBtnText, { color: colors.textPrimary }]}>명언 보러 가기</Text>
          </Pressable>

          <Text style={[styles.emptyInfo, { color: colors.textSecondary }]}>앱 재설치 시 숨긴 목록이 초기화됩니다</Text>
        </View>
      ) : (
        /* List State */
        <ScrollView 
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.infoBanner, { backgroundColor: colors.bgSurface, borderColor: colors.divider }]}>
            <EyeOff size={16} color={colors.textSecondary} />
            <Text style={[styles.infoBannerText, { color: colors.textSecondary }]}>숨긴 명언은 피드에 표시되지 않아요</Text>
          </View>

          {items.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: colors.bgSurface, borderColor: colors.divider }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.tagWrapper, { backgroundColor: colors.divider }]}>
                  <View style={[styles.tagDot, { backgroundColor: item.categoryColor }]} />
                  <Text style={[styles.tagText, { color: colors.textPrimary }]}>{item.category}</Text>
                </View>
                <Text style={[styles.cardDate, { color: colors.textSecondary }]}>{item.timeAgo}</Text>
              </View>
              
              <Text style={[styles.quoteText, { color: colors.textPrimary }]}>"{item.text}"</Text>
              <Text style={[styles.authorText, { color: colors.textSecondary }]}>— {item.author}</Text>

              <View style={styles.cardFooter}>
                <Pressable style={[styles.restoreBtn, { backgroundColor: colors.divider }]} onPress={() => handleRestore(item.id)}>
                  <RotateCcw size={16} color={colors.textSecondary} />
                  <Text style={[styles.restoreText, { color: colors.textSecondary }]}>복구</Text>
                </Pressable>
              </View>
            </View>
          ))}
          
          <Text style={[styles.listFooterInfo, { color: colors.textSecondary }]}>앱 재설치 시 숨긴 목록이 초기화됩니다</Text>
        </ScrollView>
      )}

      {/* Undo All Confirmation Sheet */}
      {isConfirmVisible && (
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsConfirmVisible(false)} />
          <View style={[styles.sheetContainer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.bgSurface }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.divider }]} />
            
            <View style={styles.sheetContent}>
              <View style={[styles.undoIconCircle, { backgroundColor: colors.isDark ? 'rgba(232, 73, 30, 0.1)' : 'rgba(232, 73, 30, 0.05)' }]}>
                <RotateCcw size={32} color={colors.actionCta} strokeWidth={2.5} />
              </View>
              
              <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>모두 되돌릴까요?</Text>
              <Text style={[styles.sheetDesc, { color: colors.textSecondary }]}>
                숨긴 명언 {items.length}개가 다시 피드에 표시돼요
              </Text>

              <Pressable style={styles.sheetCtaBtn} onPress={handleRestoreAll}>
                <Text style={styles.sheetCtaText}>전체 되돌리기</Text>
              </Pressable>

              <Pressable style={styles.sheetCancelBtn} onPress={() => setIsConfirmVisible(false)}>
                <Text style={[styles.sheetCancelText, { color: colors.textSecondary }]}>취소</Text>
              </Pressable>
            </View>
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
  restoreAllText: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.6)',
    fontWeight: '500',
  },
  headerSub: {
    marginTop: -4,
  },
  headerCount: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.4)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: -60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4F3EF',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: 'rgba(244,243,239,0.5)',
    marginBottom: 32,
  },
  goBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    marginBottom: 40,
  },
  goBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F4F3EF',
  },
  emptyInfo: {
    fontSize: 11,
    color: 'rgba(244,243,239,0.2)',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  infoBannerText: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.4)',
    fontWeight: '500',
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
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  restoreText: {
    fontSize: 13,
    color: 'rgba(244,243,239,0.6)',
    fontWeight: '600',
  },
  listFooterInfo: {
    fontSize: 11,
    color: 'rgba(244,243,239,0.15)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sheetContainer: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 32,
  },
  sheetContent: {
    alignItems: 'center',
  },
  undoIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(232, 73, 30, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4F3EF',
    marginBottom: 12,
  },
  sheetDesc: {
    fontSize: 15,
    color: 'rgba(244,243,239,0.5)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  sheetCtaBtn: {
    width: '100%',
    backgroundColor: '#E8491E',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sheetCtaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sheetCancelBtn: {
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCancelText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(244,243,239,0.4)',
  },
});

