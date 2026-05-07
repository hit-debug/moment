import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, PenLine, Share2, MoreHorizontal, Palette, Lock } from 'lucide-react-native';
import { mockQuotes, type MockQuote } from '@/data/mockQuotes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeStore, useThemeColors } from '@/stores/themeStore';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = 60;

function getQuoteFontSize(text: string): number {
  const len = text.length;
  if (len <= 50) return 24;
  if (len <= 100) return 20;
  return 17;
}

/* ------------------------------------------------------------------ */
/* Action Bar                                                         */
/* ------------------------------------------------------------------ */
function InlineActionBar({
  isLiked,
  onLike,
  onShare,
  onJournal,
  onMore,
  isDark,
}: {
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  onJournal: () => void;
  onMore: () => void;
  isDark: boolean;
}) {
  const iconColor = isDark ? 'rgba(244,243,239,0.85)' : 'rgba(0,0,0,0.65)';
  const dockBg = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)';
  const dockBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  return (
    <View style={[styles.dockContainer, { backgroundColor: dockBg, borderColor: dockBorder }]}>
      <Pressable onPress={onLike} style={styles.iconBtn}>
        <Heart 
          size={22} 
          color={isLiked ? '#E8607A' : iconColor} 
          fill={isLiked ? '#E8607A' : 'none'} 
          strokeWidth={2} 
        />
      </Pressable>
      <Pressable onPress={onJournal} style={styles.iconBtn}>
        <PenLine size={22} color={iconColor} strokeWidth={2} />
      </Pressable>
      <Pressable onPress={onShare} style={styles.iconBtn}>
        <Share2 size={22} color="#E8491E" strokeWidth={2.25} />
      </Pressable>
      <Pressable onPress={onMore} style={styles.iconBtn}>
        <MoreHorizontal size={22} color={iconColor} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Quote Canvas                                                       */
/* ------------------------------------------------------------------ */
function QuoteCanvas({
  quote,
  isLiked,
  onLike,
  onJournal,
  onShare,
  onMore,
}: {
  quote: MockQuote;
  isLiked: boolean;
  onLike: () => void;
  onJournal: () => void;
  onShare: () => void;
  onMore: () => void;
}) {
  const { selectedFontFamily } = useThemeStore();
  const colors = useThemeColors();
  const fontSize = getQuoteFontSize(quote.text);
  const visibleCategories = quote.categories.slice(0, 2);

  // 폰트 스타일 객체
  const textStyle = { fontFamily: selectedFontFamily };

  return (
    <View style={styles.canvasContainer}>
      <View style={styles.contentWrapper}>
        <View style={styles.contentInner}>
          
          {/* Tags */}
          <View style={styles.tagsContainer}>
            {visibleCategories.map(cat => (
              <View key={cat} style={styles.tagBadge}>
                <Text style={styles.tagText}>{cat}</Text>
              </View>
            ))}
          </View>

          {/* Quote Mark */}
          <Text style={[styles.quoteMark, textStyle]}>"</Text>

          {/* Body Text */}
          <Text style={[styles.quoteBody, { fontSize, lineHeight: fontSize * 1.6 }, textStyle]}>
            {quote.text}
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Author */}
          <Text style={[styles.authorText, textStyle]}>{quote.author}</Text>

          {/* Author Role */}
          {quote.authorRole && (
            <Text style={[styles.authorRoleText, textStyle]}>{quote.authorRole}</Text>
          )}

          {/* Action Dock */}
          <View style={styles.actionDockWrapper}>
            <InlineActionBar
              isLiked={isLiked}
              onLike={onLike}
              onJournal={onJournal}
              onShare={onShare}
              onMore={onMore}
              isDark={colors.isDark}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Main Screen                                                        */
/* ------------------------------------------------------------------ */
export default function QuoteTodayScreen() {
  const router = useRouter();
  const themeStore = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [userStatus, setUserStatus] = useState<'guest' | 'free' | 'subscribed'>('subscribed');
  const translateX = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const quotes = mockQuotes;
  const currentQuote = quotes[currentIndex];
  const isLiked = currentQuote ? likedIds.has(currentQuote.id) : false;

  const goNext = useCallback(() => {
    if (quotes.length === 0) return;
    Animated.timing(translateX, { toValue: -SCREEN_W, duration: 250, useNativeDriver: Platform.OS !== 'web' }).start(() => {
      translateX.setValue(0);
      setCurrentIndex((i) => (i + 1) % quotes.length);
    });
  }, [quotes.length, translateX]);

  const goPrev = useCallback(() => {
    if (quotes.length === 0) return;
    Animated.timing(translateX, { toValue: SCREEN_W, duration: 250, useNativeDriver: Platform.OS !== 'web' }).start(() => {
      translateX.setValue(0);
      setCurrentIndex((i) => (i - 1 + quotes.length) % quotes.length);
    });
  }, [quotes.length, translateX]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderMove: (_, gestureState) => translateX.setValue(gestureState.dx),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -SWIPE_THRESHOLD) goNext();
          else if (gestureState.dx > SWIPE_THRESHOLD) goPrev();
          else {
            Animated.spring(translateX, { toValue: 0, useNativeDriver: Platform.OS !== 'web', tension: 100, friction: 10 }).start();
          }
        },
      }),
    [goNext, goPrev, translateX]
  );

  const handleLike = () => {
    if (!currentQuote) return;
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(currentQuote.id)) next.delete(currentQuote.id);
      else next.add(currentQuote.id);
      return next;
    });
  };

  const handleJournal = () => {
    if (userStatus === 'guest') {
      if (Platform.OS === 'web') {
        window.alert('로그인이 필요합니다.\n저널 기능은 무료 회원 이상 이용할 수 있습니다.');
      } else {
        Alert.alert('로그인 필요', '저널 기능은 무료 회원 이상 이용할 수 있습니다.', [{ text: '확인' }]);
      }
      return;
    }
    router.push('/(modals)/journal-write');
  };

  const handleShare = () => {
    const params = {
      quote: currentQuote.text,
      author: currentQuote.author,
    };
    if (userStatus === 'guest') {
      router.push({ pathname: '/(modals)/quote-share', params: { ...params, guestMode: 'true' } } as any);
      return;
    }
    router.push({ pathname: '/(modals)/quote-share', params } as any);
  };

  const handleCustomize = () => {
    if (userStatus === 'guest') {
      if (Platform.OS === 'web') {
        window.alert('Moment Look 기능은 로그인 후 이용할 수 있습니다.');
      } else {
        Alert.alert('로그인 필요', 'Moment Look 기능은 로그인 후 이용할 수 있습니다.', [{ text: '확인' }]);
      }
      return;
    }
    router.push('/(modals)/quote-customize');
  };

  const handleMore = () => {
    router.push('/(modals)/more-options');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgDeep }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 고정된 배경 이미지 및 그라데이션 */}
      <View style={StyleSheet.absoluteFill}>
        <ExpoImage
          source={(() => {
            const base = themeStore.selectedThemeImage || currentQuote?.bg_image || 'https://images.unsplash.com/photo-1497215848147-750f003714b6';
            // 이미 파라미터가 포함되어 있다면 중복 방지를 위해 기본 base만 사용하거나 필터링
            if (base.includes('?')) {
              // 기존 파라미터가 있는 경우, q=80&w=1080 등이 이미 포함되어 있을 수 있으므로 정규화
              return base.split('?')[0] + '?q=80&w=1080&auto=format&fit=crop';
            }
            return base + '?q=80&w=1080&auto=format&fit=crop';
          })()}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={500}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent']}
          style={[styles.scrimTop, { pointerEvents: 'none' }]}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={[styles.scrimBottom, { pointerEvents: 'none' }]}
        />
      </View>

      {currentQuote && (
        <Animated.View
          style={[styles.container, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          <QuoteCanvas
            key={currentQuote.id}
            quote={currentQuote}
            isLiked={isLiked}
            onLike={handleLike}
            onJournal={handleJournal}
            onShare={handleShare}
            onMore={handleMore}
          />
        </Animated.View>
      )}

      {/* Header */}
      <View style={[styles.header, { top: Math.max(insets.top, 24) }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.logoText}>Moment</Text>
        </View>

        {/* Status Toggle */}
        <View style={styles.statusToggle}>
          {(['guest', 'free', 'subscribed'] as const).map((status) => (
            <Pressable 
              key={status} 
              style={[styles.statusItem, userStatus === status && styles.statusItemActive]}
              onPress={() => setUserStatus(status)}
            >
              <Text style={[styles.statusText, userStatus === status && styles.statusTextActive]}>
                {status}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable 
          style={styles.headerBtn}
          onPress={handleCustomize}
        >
          {userStatus === 'guest' ? (
            <Lock size={20} color="rgba(244,243,239,0.4)" />
          ) : (
            <Palette size={24} color="#F4F3EF" />
          )}
        </Pressable>
      </View>

      {/* User Status Badge */}
      {userStatus === 'guest' && (
        <View style={styles.guestBadge}>
          <Lock size={12} color="#FFF" />
          <Text style={styles.guestBadgeText}>Guest Mode</Text>
        </View>
      )}

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {quotes.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex ? styles.dotActive : styles.dotInactive
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  scrimTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
  },
  scrimBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 360,
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: 64,
    marginBottom: 96,
  },
  contentInner: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  tagBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#F4F3EF',
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  quoteMark: {
    fontSize: 64,
    fontWeight: '300',
    color: 'rgba(244,243,239,0.5)',
    marginBottom: 12,
    lineHeight: 64,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  quoteBody: {
    color: '#F4F3EF',
    textAlign: 'center',
    fontWeight: '400',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    ...Platform.select({
      web: {
        wordBreak: 'keep-all',
      } as any,
    }),
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: 24,
    marginBottom: 12,
  },
  authorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F4F3EF',
    letterSpacing: 1,
    opacity: 0.95,
  },
  authorRoleText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#F4F3EF',
    opacity: 0.65,
    marginTop: 4,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  actionDockWrapper: {
    marginTop: 32,
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
    elevation: 100,
  },
  headerLeft: {
    width: 110,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#F4F3EF',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontStyle: 'italic',
  },
  statusToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 3,
    gap: 2,
  },
  statusItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  statusItemActive: {
    backgroundColor: '#E8491E',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(244,243,239,0.4)',
    textTransform: 'lowercase',
  },
  statusTextActive: {
    color: '#FFFFFF',
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    height: 44,
  },
  headerBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(244,243,239,0.8)',
    letterSpacing: 0.5,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 96,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#F4F3EF',
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(244,243,239,0.4)',
  },
  guestBadge: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  guestBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
