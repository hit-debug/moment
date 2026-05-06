import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  InteractionManager,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Camera, MessageSquare, Copy, Download, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore, useThemeColors } from '@/stores/themeStore';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type ShareFormat = 'full' | 'square';
type ShareMode = 'quote' | 'letter';

function getByteLength(str: string): number {
  let byte = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    byte += code > 127 ? 2 : 1;
  }
  return byte;
}

export default function QuoteShareModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ quote?: string, author?: string, content?: string }>();
  const insets = useSafeAreaInsets();
  const themeStore = useThemeStore();
  const colors = useThemeColors();
  const [format, setFormat] = useState<ShareFormat>('full');
  const [mode, setMode] = useState<ShareMode>('quote');
  const [comment, setComment] = useState('');

  const inputRef = React.useRef<TextInput>(null);

  // 저널 메뉴에서 호출 시 content 파라미터가 있음
  const isJournalShare = !!params.content;
  const quoteText = params.quote || '작은 전진이라도 매일 반복되면 결국 아무도 막을 수 없는 힘이 된다.';
  const authorText = params.author || '제임스 클리어';
  const journalText = params.content || '';

  const isLetter = mode === 'letter';
  const currentByte = getByteLength(comment);
  const MAX_BYTE = 100;

  // 명언 홈 → 편지 모드 시 키보드 포커스
  React.useEffect(() => {
    if (!isJournalShare && isLetter) {
      const task = InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 300);
      });
      return () => task.cancel();
    }
  }, [isLetter, isJournalShare]);

  const handleChangeText = (text: string) => {
    if (getByteLength(text) <= MAX_BYTE) {
      setComment(text);
    }
  };

  const getCommentFontSize = (byte: number) => {
    if (byte <= 40) return 15;
    if (byte <= 70) return 14;
    return 12;
  };

  // 배경 이미지 URL 빌더
  const bgImageUri = (() => {
    const base = themeStore.selectedThemeImage || 'https://images.unsplash.com/photo-1497215848147-750f003714b6';
    const sep = base.includes('?') ? '&' : '?';
    return base + sep + 'q=80&w=1080&auto=format&fit=crop';
  })();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Pressable style={styles.backdrop} onPress={() => router.back()} />
      <View style={[
        styles.sheet, 
        { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: colors.bgSurface },
        isJournalShare && { maxHeight: '90%' },
      ]}>
        <View style={[styles.handle, { backgroundColor: colors.divider }]} />
        
        {/* Header with Format Toggle and Close Button */}
        <View style={styles.header}>
          <View style={styles.headerSide} />
          
          <View style={[styles.formatToggle, { backgroundColor: colors.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' }]}>
            <Pressable 
              style={[styles.formatBtn, format === 'full' && styles.formatBtnActive]}
              onPress={() => setFormat('full')}
            >
              <Text style={[styles.formatText, { color: colors.textSecondary }, format === 'full' && styles.formatTextActive]}>Full</Text>
            </Pressable>
            <Pressable 
              style={[styles.formatBtn, format === 'square' && styles.formatBtnActive]}
              onPress={() => setFormat('square')}
            >
              <Text style={[styles.formatText, { color: colors.textSecondary }, format === 'square' && styles.formatTextActive]}>Square</Text>
            </Pressable>
          </View>

          <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>
            <Pressable onPress={() => router.back()} style={styles.closeBtn}>
              <X size={24} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* ===== 명언 홈 전용: 모드 토글 (명언만 공유 / 편지와 함께) ===== */}
        {!isJournalShare && (
          <View style={styles.modeToggleWrapper}>
            <View style={[styles.modeToggle, { backgroundColor: colors.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' }]}>
              <Pressable 
                style={[styles.modeBtn, mode === 'quote' && styles.modeBtnActive]}
                onPress={() => setMode('quote')}
              >
                <Text style={[styles.modeText, { color: colors.textSecondary }, mode === 'quote' && styles.modeTextActive]}>명언만 공유</Text>
              </Pressable>
              <Pressable 
                style={[styles.modeBtn, mode === 'letter' && styles.modeBtnActive]}
                onPress={() => setMode('letter')}
              >
                <Text style={[styles.modeText, { color: colors.textSecondary }, mode === 'letter' && styles.modeTextActive]}>편지와 함께</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Preview Card */}
        <View style={styles.previewContainer}>
          <View style={[
            styles.previewCard,
            format === 'square' ? styles.previewSquare : styles.previewFull,
            isJournalShare && (format === 'square' ? { width: SCREEN_W - 48 } : { width: SCREEN_W - 108 })
          ]}>
            <Image 
              source={{ uri: bgImageUri }}
              style={StyleSheet.absoluteFillObject}
            />
            
            {/* Scrims */}
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'transparent']}
              style={[styles.scrim, { top: 0, height: '40%' }]}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={[styles.scrim, { bottom: 0, height: isJournalShare ? '60%' : (format === 'full' ? '50%' : '40%') }]}
            />
            
            <View style={styles.previewContent}>
              {/* ===== 명언 홈: 편지 모드 시 편지 입력 ===== */}
              {!isJournalShare && isLetter && (
                <Pressable 
                  style={styles.letterArea}
                  onPress={() => inputRef.current?.focus()}
                >
                  <TextInput
                    ref={inputRef}
                    style={[styles.letterInput, { fontSize: getCommentFontSize(currentByte) }]}
                    placeholder="이 글귀를 전하고 싶은 분에게 한 줄을 남겨보세요."
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    multiline
                    scrollEnabled={false}
                    value={comment}
                    onChangeText={handleChangeText}
                    selectionColor="#E8491E"
                  />
                  <View style={styles.letterDivider} />
                </Pressable>
              )}

              {/* 명언 텍스트 */}
              <Text style={[
                styles.previewQuote, 
                !isJournalShare && isLetter && { fontSize: 13, marginTop: 8 },
                isJournalShare && { fontSize: 13, marginTop: 16, fontFamily: themeStore.selectedFontFamily },
                Platform.OS === 'web' && { wordBreak: 'keep-all' } as any
              ]}>
                {quoteText}
              </Text>
              <Text style={[
                styles.previewAuthor, 
                !isJournalShare && isLetter && { fontSize: 11, marginTop: 6 },
                isJournalShare && { fontSize: 11, marginTop: 4, fontFamily: themeStore.selectedFontFamily },
              ]}>
                — {authorText}
              </Text>
              
              {/* ===== 저널 메뉴 전용: 나의 기록 표시 ===== */}
              {isJournalShare && (
                <View style={styles.journalArea}>
                  <View style={styles.journalDivider} />
                  <Text style={[
                    styles.journalText, 
                    { fontFamily: themeStore.selectedFontFamily },
                    Platform.OS === 'web' && { wordBreak: 'keep-all' } as any
                  ]}>
                    {journalText}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.watermark}>Moment</Text>
          </View>
        </View>

        {/* ===== 명언 홈 전용: 바이트 카운터 ===== */}
        {!isJournalShare && (
          <View style={styles.byteCounterWrapper}>
            {isLetter && (
              <Text style={[
                styles.byteCounter,
                { color: colors.textSecondary },
                currentByte >= MAX_BYTE && { color: '#E8491E' }
              ]}>
                {currentByte} / {MAX_BYTE} bytes
              </Text>
            )}
          </View>
        )}

        {/* Bottom Divider */}
        <View style={styles.bottomDivider} />

        {/* Share Channels */}
        <View style={styles.shareChannels}>
          <View style={styles.channelItem}>
            <LinearGradient
              colors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
              style={styles.channelIcon}
            >
              <Camera size={26} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.channelLabel, { color: colors.textSecondary }]}>인스타그램</Text>
          </View>
          <View style={styles.channelItem}>
            <View style={[styles.channelIcon, { backgroundColor: '#FEE500' }]}>
              <MessageSquare size={26} color="#3C1E1E" fill="#3C1E1E" />
            </View>
            <Text style={[styles.channelLabel, { color: colors.textSecondary }]}>카카오톡</Text>
          </View>
          <View style={styles.channelItem}>
            <View style={[styles.channelIcon, { backgroundColor: '#34C759' }]}>
              <MessageCircle size={26} color="#FFF" fill="#FFF" />
            </View>
            <Text style={[styles.channelLabel, { color: colors.textSecondary }]}>메시지</Text>
          </View>
          <View style={styles.channelItem}>
            <View style={[styles.channelIcon, { backgroundColor: '#4B5563' }]}>
              <Download size={24} color="#FFF" />
            </View>
            <Text style={[styles.channelLabel, { color: colors.textSecondary }]}>이미지저장</Text>
          </View>
          <View style={styles.channelItem}>
            <View style={[styles.channelIcon, { backgroundColor: '#4B5563' }]}>
              <Copy size={22} color="#FFF" />
            </View>
            <Text style={[styles.channelLabel, { color: colors.textSecondary }]}>텍스트복사</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: '#2C3340',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 12,
    maxHeight: '94%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 44,
    marginBottom: 8,
  },
  headerSide: {
    flex: 1,
  },
  closeBtn: {
    padding: 8,
  },
  formatToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 4,
  },
  formatBtn: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 16,
  },
  formatBtnActive: {
    backgroundColor: '#E8491E',
  },
  formatText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(244,243,239,0.5)',
  },
  formatTextActive: {
    color: '#FFFFFF',
  },
  modeToggleWrapper: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 4,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#E8491E',
  },
  modeText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(244,243,239,0.5)',
  },
  modeTextActive: {
    color: '#FFFFFF',
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  previewFull: {
    width: SCREEN_W * 0.52,
    aspectRatio: 9 / 16,
  },
  previewSquare: {
    width: SCREEN_W * 0.8,
    aspectRatio: 1,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  previewContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  // 명언 홈 전용: 편지 입력 영역
  letterArea: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  letterInput: {
    width: '100%',
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 40,
    fontWeight: '500',
  },
  letterDivider: {
    width: '60%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginTop: 8,
    marginBottom: 12,
  },
  // 저널 메뉴 전용: 나의 기록 영역
  journalArea: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  journalDivider: {
    width: '30%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginBottom: 8,
  },
  journalText: {
    width: '100%',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  previewQuote: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewAuthor: {
    fontSize: 13,
    color: '#FFF',
    fontWeight: '700',
  },
  watermark: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontStyle: 'italic',
    zIndex: 10,
  },
  byteCounterWrapper: {
    paddingHorizontal: 32,
    height: 24,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  byteCounter: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  bottomDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  shareChannels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  channelItem: {
    alignItems: 'center',
    gap: 10,
  },
  channelIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelLabel: {
    fontSize: 11,
    color: 'rgba(244,243,239,0.7)',
    fontWeight: '600',
  },
});
