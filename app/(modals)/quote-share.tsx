import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Camera, MessageSquare, Copy, Download } from 'lucide-react-native';

const { width: SCREEN_W } = Dimensions.get('window');

export default function QuoteShareModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [format, setFormat] = useState<'full' | 'square'>('full');

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.handle} />
        
        <View style={styles.header}>
          <Text style={styles.title}>공유하기</Text>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <X size={24} color="rgba(244,243,239,0.5)" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Format Toggle */}
          <View style={styles.formatToggle}>
            <Pressable 
              style={[styles.formatBtn, format === 'full' && styles.formatBtnActive]}
              onPress={() => setFormat('full')}
            >
              <Text style={[styles.formatText, format === 'full' && styles.formatTextActive]}>Full</Text>
            </Pressable>
            <Pressable 
              style={[styles.formatBtn, format === 'square' && styles.formatBtnActive]}
              onPress={() => setFormat('square')}
            >
              <Text style={[styles.formatText, format === 'square' && styles.formatTextActive]}>Square</Text>
            </Pressable>
          </View>

          {/* Preview Card */}
          <View style={styles.previewContainer}>
            <View style={[
              styles.previewCard,
              format === 'square' ? styles.previewSquare : styles.previewFull
            ]}>
              <View style={styles.previewPlaceholder} />
              <View style={styles.previewContent}>
                <Text style={styles.previewQuote}>"작은 전진이라도 매일 반복되면 결국 아무도 막을 수 없는 힘이 된다."</Text>
                <Text style={styles.previewAuthor}>— 제임스 클리어</Text>
              </View>
              <Text style={styles.watermark}>Moment</Text>
            </View>
          </View>

          {/* Share Channels */}
          <View style={styles.shareChannels}>
            <View style={styles.channelItem}>
              <View style={[styles.channelIcon, { backgroundColor: '#E4405F' }]}>
                <Camera size={28} color="#FFF" />
              </View>
              <Text style={styles.channelLabel}>인스타그램</Text>
            </View>
            <View style={styles.channelItem}>
              <View style={[styles.channelIcon, { backgroundColor: '#FEE500' }]}>
                <MessageSquare size={28} color="#3C1E1E" />
              </View>
              <Text style={styles.channelLabel}>카카오톡</Text>
            </View>
            <View style={styles.channelItem}>
              <View style={[styles.channelIcon, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                <Copy size={24} color="#F4F3EF" />
              </View>
              <Text style={styles.channelLabel}>링크 복사</Text>
            </View>
            <View style={styles.channelItem}>
              <View style={[styles.channelIcon, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                <Download size={24} color="#F4F3EF" />
              </View>
              <Text style={styles.channelLabel}>이미지 저장</Text>
            </View>
          </View>
        </ScrollView>
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
    height: '85%',
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
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4F3EF',
  },
  closeBtn: {
    padding: 4,
  },
  formatToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 4,
    alignSelf: 'center',
    marginBottom: 24,
  },
  formatBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  formatBtnActive: {
    backgroundColor: '#E8491E',
  },
  formatText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(244,243,239,0.4)',
  },
  formatTextActive: {
    color: '#FFFFFF',
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  previewCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  previewFull: {
    width: SCREEN_W * 0.6,
    aspectRatio: 9 / 16,
  },
  previewSquare: {
    width: SCREEN_W * 0.75,
    aspectRatio: 1,
  },
  previewPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a1a',
  },
  previewContent: {
    alignItems: 'center',
  },
  previewQuote: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewAuthor: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  watermark: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontStyle: 'italic',
  },
  shareChannels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  channelItem: {
    alignItems: 'center',
    gap: 8,
  },
  channelIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelLabel: {
    fontSize: 12,
    color: 'rgba(244,243,239,0.6)',
    fontWeight: '500',
  },
});
